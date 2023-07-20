const statusModel = require("../models/statusModel");
const mongoose = require("mongoose");
const status = async (req, res) => {
  try {
    const {
      body: { statusName, statusColor },
    } = req;
    const data = await statusModel.create({ statusName, statusColor });
    return res.status(200).json({ sucssee: true, data });
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
const statusview = async (req, res) => {
  try {
    const { page, search, pagePerRecords, sortFieldKey, sortKey } = req.query;
    let query = {};
    //search
    if (search) {
      query.$or = [
        { statusName: { $regex: "^" + search, $options: "i" } },
        { statusColor: { $regex: "^" + search, $options: "i" } },
      ];
    }
    //sort
    let sort_query = {};
    if (sort_query) {
      sort_query[sortFieldKey] = sortKey == "desc" ? -1 : 1;
    }
    //pagination
    let pageNumber = 1;
    if (page) {
      pageNumber = Number(page);
    }
    let skip = parseInt(pageNumber * pagePerRecords) - pagePerRecords;
    let totleRecod = await statusModel.find(query).countDocuments();
    let blog = await statusModel
      .find(query)
      .limit(pagePerRecords)
      .skip(skip)
      .sort(sort_query);
    return res.status(200).json({ blog, totleRecod });
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
const statusdelete = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid delete ID" });
    }
    const data = await statusModel.findByIdAndDelete(id);
    return res.status(200).json({ sucssee: true, msg: "Record is delete !!" });
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
const updated = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid delete ID" });
    }
    const data = await statusModel.findByIdAndUpdate(id, req.body);
    return res
      .status(200)
      .json({ sucssee: true, mag: "Record is updated !!!", data });
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
module.exports = { status, statusview, statusdelete, updated };