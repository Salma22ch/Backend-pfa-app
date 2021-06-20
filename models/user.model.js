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
        type: Array
    },
    panels:{
        type:Array
    },
    consumption :{
        type:Array
    }
})

module.exports =mongoose.model("User", User);