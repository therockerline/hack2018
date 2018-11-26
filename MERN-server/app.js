const express = require("express");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const fs = require('fs');
const where = require('node-where');
const cors = require("cors");
const controller = require("./controller");
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(
  cors({
    origin: [
      "http://localhost:3000"
    ],
    methods: ["GET", "HEAD", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true
  })
);
app.use(
  session({
    secret: "supersecretstring12345!",
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 60000 * 30 }
  })
);
mongoose.connect('mongodb://asd:asdasdasd1@ds159274.mlab.com:59274/blackdiamond', {
   useNewUrlParser: true
  })
mongoose.connection.on('connected', function(){  
console.log("========= Il database è attivato");
});
mongoose.connection.on('error', function(err){
console.log("Errore Database:"+err+"");
});
controller(app);
app.listen(process.env.PORT || 8000, () => console.log("========= BlackDiamond REST-API : localhost:8000 "));
process.on('SIGINT', function(){
    mongoose.connection.close(function(){
      console.log("Database disconnesso");
       process.exit(0);
      });
});