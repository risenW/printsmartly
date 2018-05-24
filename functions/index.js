
const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var expressHbs = require('express-handlebars');
const firebase = require('firebase-admin');

//Routes 
const routes = require('./routes/helper');

const firebaseApp = firebase.initializeApp(
  functions.config().firebase
);

const app = express();

//View engines
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');


// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//home page
app.get('/', routes.home);  

//Single product designs
app.post('/designs', (req,res)=>{
  var productdesign = req.body.productdesign;
  console.log("received :" + productdesign);

  getDatafromFirebase(productdesign).then((data)=>{
      console.log(data);
      getArrayFromFirebaseData(data).then((array) =>{

        res.render('design', {productdesigns: array});

      });
      
  }).catch((err)=>{
      console.log(err);
  });

});

//Different types of banners
app.get('/banners', routes.banners);

//Any other page not listed up above renders an error
app.get('**', routes.errorpage)


function getDatafromFirebase(productdesign){
  return new Promise((resolve,reject)=>{

      var myRef = firebaseApp.database().ref('Products').child('Designs').child(productdesign);
      myRef.once("value").then((snapshot) => {
          var data = snapshot.val();
          resolve(data); 

      }).catch((err)=>{

          reject(err);
      });
  })
}

function getArrayFromFirebaseData(productdesigns){
  return new Promise((resolve,reject)=>{
    var keys = Object.keys(productdesigns);
    var array_of_productdesigns = []
    
    for(var i = 0; i < keys.length; i++){
      var key = keys[i];
      array_of_productdesigns.push(productdesigns[key]);
    }
    resolve(array_of_productdesigns);

  });
}


exports.app = functions.https.onRequest(app);