const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const qs = require("querystring");
//const checksum_lib =require("./paytm/checksum");
//const config =require("./paytm/config");
app.use(express.static("express"));
const BookNow=require("./models/apartment")
//const PayNow=require("./models/paytm")

require("./db/conn");
const Register = require("./models/registers");


const port = process.env.PORT || 5000;

const static_path = path.join(__dirname, "./public" );
const template_path = path.join(__dirname, "./templates/views" );
const partials_path = path.join(__dirname, "./templates/partials" );

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);


app.get("/home", (req, res) => {
    res.render("index")
});

app.get("/register", (req, res) =>{
    res.render("register");
})

app.get("/login", (req, res) =>{
    res.render("login");
})

// create a new user in our database
app.post("/register", async (req, res) =>{
    try {

      const password = req.body.password;
      const cpassword = req.body.confirmpassword;

      if(password === cpassword){
        
        const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                gender:req.body.gender,
                phone:req.body.phone,
                age:req.body.age,
                password:req.body.password,
                confirmpassword:req.body.confirmpassword    
        })

        console.log("the success part" + registerEmployee);

        const token = await registerEmployee.generateAuthToken();
        console.log("the token part" + token);

        const registered = await registerEmployee.save();
        console.log("the page part" + registered);

        res.status(201).render("index");

      }else{
          res.send("password are not matching")
      }
        
    } catch (error) {
        res.status(400).send(error);
        console.log("the error part page ");
    }
})
//app.use('/hi', function(req,res){
//    res.sendFile(path.join(__dirname+'/express/index.hbs'));
//    __dirname : It will resolve to your project folder.
//  });
 // const Register = require("./models/registers");
const { json } = require("express");
const { log } = require("console");

//const port = process.env.PORT || 3000;

//const static_path = path.join(__dirname, "../public" );
//const template_path = path.join(__dirname, "../templates/views" );
//const partials_path = path.join(__dirname, "../templates/partials" );


//app.use(express.static(static_path));
//app.set("view engine", "hbs");
//app.set("views", template_path);
//hbs.registerPartials(partials_path);


//app.get("/", (req, res) => {
//    res.render("index")
//});



// login check

app.post("/login", async(req, res) =>{
   try {
    
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});

        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("the token part" + token);
       
        if(isMatch){
            res.status(201).render("index");
        }else{
           res.send("invalid Password Details"); 
        }
    
   } catch (error) {
       res.status(400).send("invalid login Details")
   }
})



// const bcrypt = require("bcryptjs");

// const securePassword = async (password) =>{

//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     const passwordmatch = await bcrypt.compare("thapa@123", passwordHash);
//     console.log(passwordmatch);

// }

// securePassword("thapa@123");


// const jwt = require("jsonwebtoken");

// const createToken = async() => {
//     const token = await jwt.sign({_id:"5fb86aaf569ea945f8bcd2e1"}, "mynameisvinodbahadurthapayoutuber", {
//         expiresIn:"2 seconds"
//     });
//     console.log(token);

//     const userVer = await jwt.verify(token, "mynameisvinodbahadurthapayoutuber");
//     console.log(userVer);
// }


// createToken();
//payment code
// const parseUrl = express.urlencoded({ extended: false });
// const parseJson = express.json({ extended: false });


// app.get("/payment", (req, res) => {
//   console.log("payment successful")
//   res.sendFile(path.join(__dirname+'/express/index1.html'));
// });
// app.post("/paynow", [parseUrl, parseJson], (req, res) => {
//     // Route for making payment
  
//     var paymentDetails = {
//       amount: req.body.amount,
//       customerId: req.body.name,
//       customerEmail: req.body.email,
//       customerPhone: req.body.phone
//   }
//   if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
//       res.status(400).send('Payment failed')
//   } else {
//       var params = {};
//       params['MID'] = config.PaytmConfig.mid;
//       params['WEBSITE'] = config.PaytmConfig.website;
//       params['CHANNEL_ID'] = 'WEB';
//       params['INDUSTRY_TYPE_ID'] = 'Retail';
//       params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
//       params['CUST_ID'] = paymentDetails.customerId;
//       params['TXN_AMOUNT'] = paymentDetails.amount;
//       params['CALLBACK_URL'] = 'http://localhost:4000/callback';
//       params['EMAIL'] = paymentDetails.customerEmail;
//       params['MOBILE_NO'] = paymentDetails.customerPhone;
  
  
//       checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
//           var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
//           // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
  
//           var form_fields = "";
//           for (var x in params) {
//               form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
//           }
//           form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
  
//           res.writeHead(200, { 'Content-Type': 'text/html' });
//           res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
//           res.end();
//       });
//   }
//   });app.post("/callback", (req, res) => {
//     // Route for verifiying payment
  
//     var body = '';
  
//     req.on('data', function (data) {
//        body += data;
//     });
  
//      req.on('end', function () {
//        var html = "";
//        var post_data = qs.parse(body);
  
//        // received params in callback
//        console.log('Callback Response: ', post_data, "\n");
  
  
//        // verify the checksum
//        var checksumhash = post_data.CHECKSUMHASH;
//        // delete post_data.CHECKSUMHASH;
//        var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
//        console.log("Checksum Result => ", result, "\n");
  
  
//        // Send Server-to-Server request to verify Order Status
//        var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};
  
//        checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
  
//          params.CHECKSUMHASH = checksum;
//          post_data = 'JsonData='+JSON.stringify(params);
  
//          var options = {
//            hostname: 'securegw-stage.paytm.in', // for staging
//            // hostname: 'securegw.paytm.in', // for production
//            port: 443,
//            path: '/merchant-status/getTxnStatus',
//            method: 'POST',
//            headers: {
//              'Content-Type': 'application/x-www-form-urlencoded',
//              'Content-Length': post_data.length
//            }
//          };
  
  
//          // Set up the request
//          var response = "";
//          var post_req = https.request(options, function(post_res) {
//            post_res.on('data', function (chunk) {
//              response += chunk;
//            });
  
//            post_res.on('end', function(){
//              console.log('S2S Response: ', response, "\n");
  
//              var _result = JSON.parse(response);
//                if(_result.STATUS == 'TXN_SUCCESS') {
//                    res.send('payment sucess')
//                }else {
//                    res.send('payment failed')
//                }
//              });
//          });
  
//          // post the data
//          post_req.write(post_data);
//          post_req.end();
//         });
//        });
//   });


  app.post("/appointment", async (req, res) =>{
    try {
        console.log(req.body)
      {
        
        const book = new BookNow({
          yourname:req.body.youname,   
          yournumber:req.body.younumber,
          youremail:req.body.youremail,   
          ddmmyy:req.body.ddmmyy,
          yourpshychatrist:req.body.youpshychatrist,  
        })

        

        const booked = await book.save();
        res.send("your appointment is booked")
      

      }
        
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
})
  



//finishedconst path = require('path');
//chat messages start
app.get("/realtime", (req, res) => {
  console.log("he")
  res.sendFile(path.join(__dirname+'/express/index2.html'));
});
app.get("/realtime", (req, res) => {
  console.log("he")
  res.sendFile(path.join(__dirname+'/express/index3.html'));
});
app.get("/realtime", (req, res) => {
  console.log("him")
  res.sendFile(path.join(__dirname+'/express/chat.html'));
});app.get("/realtime", (req, res) => {
  console.log("him")
  res.sendFile(path.join(__dirname+'/express/chat2.html'));
});


const http = require('http');
// const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./express/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./express/users');

// const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'express')));

const botName = 'Thepchat Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Thepchat!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});
//chat messages end
//const express = require('express')
//video chat end
app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})

