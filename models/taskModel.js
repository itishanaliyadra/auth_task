const mongoose = require("mongoose");
const schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50, 
    message: "Title validation failed",
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100, 
    message: "description validation failed",
  },
  duedate:{
    type:Date,
    required:true,
    message: "dueDate validation failed",
  },
  priority:{
    type:String,
    required:true,
    message: "priority validation failed",
  },
  status:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'status'
  }
}
,{
    timestamps: true,
});
const task = mongoose.model("task", schema);
module.exports = task;
