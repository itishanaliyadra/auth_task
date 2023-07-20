require("dotenv").config();
const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const nodemailer = require("nodemailer");
const cookie = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const imagespath = path.join("imagesUplodes");

const register = async (req, res) => {
  try {
    const {
      body: { name, email, password },
    } = req;
    let bpassword = await bcrypt.hash(password, 10);
    const data = await userModel.create({ name, email, password: bpassword });
    return res.status(200).json({ sucssee: true, data });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle validation error
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      if (error.code == 11000) {
        return res.status(500).json({
          error: " Duplicate Record is not fount | email is not vaild  ",
        });
      }
      console.error("Error creating Location:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
const loginRecord = async (req, res) => {
  try {
    const {
      body: { email, password },
    } = req;
    let isdata = await userModel.findOne({ email: email });
    if (!isdata) {
      res.status(404).json({ success: false, msg: "User not found" });
    }
    if (!bcrypt.compareSync(password, isdata.password)) {
      return res
        .status(400)
        .json({ success: false, msg: "password is not match" });
    }
    console.log(isdata);
    const payload = {
      id: isdata.id,
      email: isdata.email,
    };
    const accessToken = jwt.sign(payload, secret, { expiresIn: "1d" });
    console.log(accessToken);
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      secure: false,
      httpOnly: false,
    };
    console.log(options);
    res.cookie("token", accessToken, options).json({
      success: true,
      token: accessToken,
      msg: "userlogged in successfully ",
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle validation error
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Error creating Location:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const logoutRecord = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle validation error
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Error creating Location:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
const sendemail = async (req, res) => {
  try {
    const {
      body: { email },
    } = req;
    const forgetonedata = await userModel.findOne({ email: email });
    const id = forgetonedata.id;
    if (!forgetonedata) {
      return res.status(404).json({ success: false, msg: "Email Not Found" });
    } else {
      let otp = Math.floor(Math.random() * 1000000);

      let obj = { email, otp, id };
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIl_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      console.log(process.env.EMAIl_USER);
      console.log(process.env.EMAIL_PASSWORD);

      const mailOptions = {
        from: "ishap8104@gmail.com",
        to: email,
        subject: 'Prima Infortect',
        html: `<p>otp:-${otp}</p>`,
      };

      console.log(mailOptions);
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log();
          console.log("Error:", error);
        } else {
          res.cookie("obj", obj);
          console.log("Email sent:", info.response);
          return res
            .status(200)
            .json({ success: true, msg: "OTP verification" });
        }
      });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle validation error
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Error creating Location:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
const otp = async (req, res) => {
  try {
    const {
      body: { otp },
    } = req;
    if (otp == req.cookies.obj.otp) {
      return res
        .status(200)
        .json({ success: true, msg: "change your password !!" });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle validation error
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Error creating Location:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
const newpass = async (req, res) => {
  try {
    const {
      body: { password, newcpassword },
    } = req;
    if (password == newcpassword) {
      let id = req.cookies.obj.id;
      let user = await userModel.update({ password }, { where: { id } });
      if (user) {
        res.clearCookie("obj");
        return res.status(200).json({
          success: true,
          msg: "new password is successfully updated  !!",
        });
      }
    }
    return res
      .status(404)
      .json({ success: false, msg: "password and cpassword is not valid !!" });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle validation error
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.error("Error creating Location:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const profileUpdated = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid updated ID" });
    }
    if (req.file) {
      console.log(req.body);
      const profile = await userModel.findById(id);
      if (profile.images != "imagesUlodes/adminimags.jpg") {
        fs.unlinkSync(profile.images);
      }

      const images = `${imagespath}/${req.file.filename}`;
      const uplod = await userModel.findByIdAndUpdate(
        id,
        Object.assign({ images }, req.body)
      );

      return res.status(200).json({
        success: true,
        data: uplod,
        msg: `data is update on id :- ${id}`,
      });
    } else {
      const admin = await userModel.findByIdAndUpdate(
        id,
        Object.assign({ images }, req.body)
      );
      if (!admin) {
        return res
          .status(404)
          .json({ success: false, msg: `no user id :- ${id}` });
      }
      res.status(201).json({
        success: true,
        data: user,
        msg: `update for this id :- ${id}`,
      });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle validation error
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    } else {
      if (error.code == 11000) {
        return res.status(500).json({
          error: " Duplicate Record is not fount | email is not vaild  ",
        });
      }
      console.error("Error creating Location:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = {
  register,
  loginRecord,
  logoutRecord,
  sendemail,
  otp,
  newpass,
  profileUpdated,
};
