const express = require("express");
const connectDB = require("./models/connection");
const PORT = process.env.PORT || 5000 ;
const app =express();

connectDB();

//middleware
app.use(express.json())
const userRoute=require("./routes/user")
app.use("/api",userRoute);

app.route("/").get((req,res)=>res.json("rest api "));


app.listen(PORT , ()=> console.log(`you server is running on port ${PORT}`))