const taskModel = require("../models/taskModel");
const mongoose = require("mongoose");
const taskCreate = async (req, res) => {
  try {
    const {
      body: { title, description, duedate, priority, status },
    } = req;
    // res.json({msg:"done"})
    const data = await taskModel.create({
      title,
      description,
      duedate: new Date("2023-07-10"),
      priority,
      status,
    });
    res.status(201).json({ success: true, data });
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
const taskView = async (req, res) => {
  try {
    const { page, search, pagePerRecords, sortFieldKey, sortKey } = req.query;
    let query = {};
    //search
    if (search) {
      query.$or = [
        { title: { $regex: "^" + search, $options: "i" } },
        { description: { $regex: "^" + search, $options: "i" } },
        { priority: { $regex: "^" + search, $options: "i" } },
        
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
    let totleRecod = await taskModel.find(query).countDocuments();
    let task = await taskModel
      .find(query)
      .limit(pagePerRecords)
      .skip(skip)
      .sort(sort_query);
    return res.status(200).json({ task, totleRecod });
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
const taskFindOne = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid delete ID" });
    }
    const data = await taskModel.findById(id);
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
const deleteRecord = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid delete ID" });
    }
    const data = await taskModel.findByIdAndDelete(id);
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
const updatedRecod = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid delete ID" });
    }
    const data = await taskModel.findByIdAndUpdate(id, req.body);
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

module.exports = {
  taskCreate,
  taskView,
  taskFindOne,
  deleteRecord,
  updatedRecod,
};
