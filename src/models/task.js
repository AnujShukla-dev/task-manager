const mongoose = require("mongoose");

const taskSchmea = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
},{
  timestamps:true
})
const Task = mongoose.model("Tasks",taskSchmea );

module.exports = { Task };
