const express  = require("express");
require("./db/mongoose.js");
const {User} = require("./models/user.js")
const {Task} = require("./models/task.js")

const app = express();
app.use(express.json())

const port = process.env.PORT|| 3001;
console.log(port);

app.post('/users',(req,res)=>{
  
    const user = new User(req.body);
    user.save().then(()=>{
        res.send(user)
    }).catch((e)=>{
        res.status(400).send(e)   
    })
});

app.get('/users',(req,res)=>{
  
 User.find({}).then((users)=>{
        res.send(user)

    }).catch(e=>{
        res.status(500).send(e)
    })
});

app.get('/user/:id',(req,res)=>{
    console.log(req.params.id);
    const _id = req.params.id;
    User.findById(_id).then((user)=>{
      if(!user){
        return res.status(404).send()
      }
      res.send(user)
    }).catch(e=>{
        res.status(500).send(e)
    })
})

app.post('/tasks',(req,res)=>{
    const saveTask  = new Task(req.body)
    saveTask.save().then(()=>{
        res.send(saveTask)
    }).catch((error)=>{
        res.status(400).send(error)
    })
});
app.get("/tasks",(req,res)=>{
    Task.find({}).then(task=>{
        res.send(task)
    }).catch(e=>{
        res.status(500).send(e)
    })
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})