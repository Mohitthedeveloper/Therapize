const mongoose = require("mongoose");

const Booknow = new mongoose.Schema({
    yourname : {
        type:String,
        required:true
    },
    yournumber: {
        type:Number,
        required:true
        
    },
    youremail: {
        type: String,
        required:true
    },
    ddmmyy: {
        type:String,
        required:true,
        
    },
    yourpshychatrist: {
        type:String,
        required:true,
    },
   
        })
    
    







// now we need to create a collections

const BookNow = new mongoose.model("Book Now",Booknow);

module.exports = BookNow;