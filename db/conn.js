const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://lowdu:lowdu@cluster0.bh5ih.mongodb.net/?retryWrites=true&w=majority").then(() => {
    console.log(`connection successful`);
}).catch((e) =>{
    console.log(e);

})