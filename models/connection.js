const mongoose = require('mongoose');

const URI = "mongodb+srv://Salma:root@firstcluster.b5lqc.mongodb.net/testdb?retryWrites=true&w=majority"

const connectDB = async () => {
    await mongoose.connect(URI,{ useCreateIndex: true,useNewUrlParser: true ,useUnifiedTopology: true})
    console.log("database has been connected");
}

module.exports = connectDB ;