const mongoose = require("mongoose");

mongoose.connect( "mongodb+srv://cluster0.pzhhz.mongodb.net/therapize").


then(() => {
    console.log(`connection successful`);
}).catch((e) =>{
    console.log(`no connection`);

})