require('../src/db/mongoose.js');
const {Task} = require('../src/models/task.js');

// Task.findByIdAndDelete('642083427e06993e22cf915d').then((result)=>{
//   return Task.countDocuments({'completed': true});
// }).then((count)=>{
//   console.log('Document Count with completed true', count);
// }).catch((e)=>{
//   console.log(e);
// });


const findAndDelete = async (id, condition)=>{
  const deleteOperation = await Task.findByIdAndDelete(id);
  console.log(deleteOperation);
  const count = await Task.countDocuments({'completed': true});
  return count;
};

findAndDelete('643ad97f5d153f3fd5b7d9ba', {'completed': true}).then((result)=>{
  console.log(result);
}).catch((e)=>{
  console.log(e);
});
