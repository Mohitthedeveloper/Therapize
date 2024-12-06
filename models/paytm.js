const mongoose = require("mongoose");

const Booknow = new mongoose.Schema({
  //  yourname : {
      //  type:String,
    //    required:true
  //  },
    //yournumber: {
      //  type:Number,
        //required:true
        
   // },
    youremail: {
        type: String,
        required:true
    },
    ddmmyy: {
        type:String,
        required:true,
        
    },
   //amount: {
   // type:Integer,
    //required:true,
   //},
   
        })//
    //
    







// now we need to create a collections

//const BookNow = new mongoose.model("Pay Now",PayNow);

//module.exports = PayNow;