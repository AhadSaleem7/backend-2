
const express = require('express')
const App = express();
require("./conn/conn");
const authRoutes = require("./Routes/auth")
const list = require("./Routes/list")
App.use(express.json());
App.get("/",(req,res)=>{
  res.send("hello")
});
const cors = require("cors");
App.use(cors());
App.use("/api/v1",authRoutes)
App.use("/api/v2",list)
App.listen(5000,(req,res)=>{
  console.log("started bro")
});
