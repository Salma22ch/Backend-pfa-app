const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const User=Schema({
    email:{
        type: String,
        required:true,
        unique:true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },

    password:{
        type: String,
        required :true
    },
    battery:{
        type: String
    },
    panels:{
        type:String
    },
    consumption :{
        type:String
    }
})

module.exports =mongoose.model("User", User);