const {MongoClient, ObjectId} = require('mongodb');
const connectionURL = `mongodb://localhost:27017`;
const databaseName = 'task-manager';
const MongoDbClient = new MongoClient(connectionURL);
const id = new ObjectId();
console.log(id.getTimestamp());
console.log(id);
async function main() {
  // Use connect method to connect to the server
  await MongoDbClient.connect();
  console.log('Connected successfully to server');
  const db = MongoDbClient.db(databaseName);
  const collection = db.collection('user');

  // CREATE
  // const resInsertOne = await collection.insertOne({
  //   name: "Vikram Issar",
  //   id: id,
  //   age: 27,
  // });
  // if (resInsertOne.error) {
  //   console.log("unable to insert data");
  // } else {
  //   console.log(res);
  // }

  // const resInserMany = await collection.insertMany(
  //   [
  //     {
  //       name: "Subodh Singh",
  //       age: 25,
  //     },
  //     { name: "Vaibhav Saxena", age: 25 },
  //   ],
  //   (err, result) => {
  //     if (err) {
  //       return console.log("unable to insert documents!");
  //     } else {
  //       console.log(result);
  //     }
  //   }
  // );
  //   const collection = db.collection("tasks");
  //   const addTask = await collection.insertMany([{
  //     description:"Task 1",
  //     done:true
  //   },
  //   {
  //     description:"Task 2",
  //     done:true
  //   }, {
  //     description:"Task 3",
  //     done:false
  //   }
  // ])
  // if(addTask){
  //   console.log(addTask);
  // }

  // READ
  // const readData = await collection.find({
  //   name:"Anuj Shukla"
  // }).toArray();
  // console.log("data",readData)

  // UPDATE;
  //  const updatePromise =  await collection.updateOne({
  //     _id:new  ObjectId("64160ff7a631449ffc1af4a2")
  //   },{
  //     $set:{
  //       name:"Mike"
  //     }
  //   })
  //  console.log(updatePromise);

  // Delete

  const deleteData = await collection.deleteOne({
    _id: new ObjectId('64160ff7a631449ffc1af4a2'),
  });
  console.log(deleteData);
  return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => MongoDbClient.close());
