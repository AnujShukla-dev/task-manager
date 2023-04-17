const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://localhost:27017/task-manager-api", {
  useNewUrlParser: true,
});

// const Task = mongoose.model('Tasks',{
//     description:{
//         type:String,
//         required:true,
//         trim:true,

//     },
//     completed:{
//         type:Boolean,
//         default:false
//     }
// })

// const saveTask  = new Task({
//     description:"My Second Task",
//     completed:true
// })
// saveTask.save().then((me)=>{
// console.log(me);
// }).catch((error)=>{
//   console.log(error)
// })
