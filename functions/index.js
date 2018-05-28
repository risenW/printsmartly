
const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var expressHbs = require('express-handlebars');
const firebase = require('firebase-admin');

//Routes 
const routes = require('./routes/helper');
//helper functions
const myFunctions = require('./routes/functions');

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

//Single product type
app.post('/singletypes', (req,res)=>{
  var producttype = req.body.producttype;
  console.log("received :" + producttype);
  var myRef = firebaseApp.database().ref('Products').child('Single_product_type').child(producttype);

  myFunctions.getDatafromFirebase(myRef, producttype).then((data)=>{

    myFunctions.getArrayFromFirebaseData(data).then((array) =>{
        
        res.render('singletype', {producttypes: array});

      });
      
  }).catch((err)=>{
      console.log(err);
  });

});



// Single product designs
app.post('/designs', (req,res)=>{
  var productdesign = req.body.productdesign;
  console.log("received :" + productdesign);
  var myRef = firebaseApp.database().ref('Products').child('Designs').child(productdesign);

  myFunctions.getDatafromFirebase(myRef, productdesign).then((data)=>{
      console.log(data);
      myFunctions.getArrayFromFirebaseData(data).then((array) =>{

        res.render('design', {productdesigns: array});

      });
      
  }).catch((err)=>{
      console.log(err);
  });

});


// app.get('/seeder', (req,res)=>{

//   var types = [{
//             imagesrc: 'https://res.cloudinary.com/printivo/image/upload/q_auto:eco/v1/printivo_s3/files/category_thumbnails/1440199066_1sidecards.png',
//             name : 'One-Sided Business Cards',
//             description:'Ideal for conferences, promotional events, trade expos and displays in your own store, our high-quality roll-up banner will help you increase your brand\'s visibility. Comes with retractable stands and carrier bags.',
//             price: '₦22,999.00',
//             oldprice:'₦24,999.00',
//             size: '33 x 81 ',
//             finishing:'Printing and mounted on Rollup Banner stand',
//             delivery:'3 - 5 working days for Lagos, 5 - 7 working days for other cities',
//             material:'Full colour digital printing on PVC '
            
//         },
//       {
//         imagesrc: 'https://res.cloudinary.com/printivo/image/upload/q_auto:eco/v1/printivo_s3/files/category_thumbnails/1440201227_two-sided-business-cards-by-printivo.png',
//         name : 'Two-sided Business Cards',
//         description:'Ideal for conferences, promotional events, trade expos and displays in your own store, our high-quality roll-up banner will help you increase your brand\'s visibility. Comes with retractable stands and carrier bags.',
//         price: '₦22,999.00',
//         oldprice:'₦24,999.00',
//         size: '33 x 81 ',
//         finishing:'Printing and mounted on Rollup Banner stand',
//         delivery:'3 - 5 working days for Lagos, 5 - 7 working days for other cities',
//         material:'Full colour digital printing on PVC '

        
//       },{
        
//         imagesrc: 'https://res.cloudinary.com/printivo/image/upload/q_auto:eco/v1/printivo_s3/files/category_thumbnails/1440202729_Square-business-cards.png',
//         name : 'Square Business Cards (1 sided)',
//         description:'Ideal for conferences, promotional events, trade expos and displays in your own store, our high-quality roll-up banner will help you increase your brand\'s visibility. Comes with retractable stands and carrier bags.',
//         price: '₦22,999.00',
//         oldprice:'₦24,999.00',
//         size: '33 x 81 ',
//         finishing:'Printing and mounted on Rollup Banner stand',
//         delivery:'3 - 5 working days for Lagos, 5 - 7 working days for other cities',
//         material:'Full colour digital printing on PVC '
//       }]


//   var myRef = firebaseApp.database().ref('Products').child('Single_product_type').child('bizcards');
//         for(var i = 0; i < types.length;i++){
//           myRef.push(types[i]).then(()=>{
//             console.log('saved: ' + i);
//           });
//         }
// });





//Different types of banners
app.get('/banners', routes.banners);

//Any other page not listed up above renders an error
app.get('**', routes.errorpage)


exports.app = functions.https.onRequest(app);