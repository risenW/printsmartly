//Helper class holds all the routes functions used in index.js
//Home route
const functions = require('firebase-functions');
const firebase = require('firebase-admin');



exports.home = (req,res)=>{
    res.render('index', {text : "Hello there again"});
};

exports.designs = (req,res) =>{
    var productdesign = req.body.productdesign;
    console.log("received :" + productdesign);

    getDatafromFirebase('bizcards').then((data)=>{
        console.log(data);
    }).catch((err)=>{
        console.log(err);
    });
};

exports.errorpage = (req,res) => {
    res.render('404');
}

exports.banners = (req,res)=>{
    res.render('banners', {title : "Order your Banners | cheap and high quality banners delivered to your doorstep"});
}



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