const express = require("express");
require("./db/mongoose.js");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT ;
const multer  = require('multer');
const upload = multer({
  dest:'images'
})
app.post('/upload', upload.single('upload'), (req,res)=>{
  res.send()
})
// app.use((req, res, next)=>{
// res.status(500).send("Site is under maintenance")
// });
app.get('/helth',(req,res)=>{
  res.status(200).send('ok')
})

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
