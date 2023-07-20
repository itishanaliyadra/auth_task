const mongoose = require("mongoose");
const schema = mongoose.Schema({
  statusName:{
    type:String,
    required:true
  },
  statusColor:{
    type:String,
    required:true
  }
}
,{
    timestamps: true,
});
const status = mongoose.model("status", schema);
module.exports = status;
