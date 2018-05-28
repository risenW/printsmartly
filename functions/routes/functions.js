exports.getDatafromFirebase = (db_reference,productdesign) =>{
    return new Promise((resolve,reject)=>{
  
        db_reference.once("value").then((snapshot) => {
            var data = snapshot.val();
            resolve(data); 
  
        }).catch((err)=>{
  
            reject(err);
        });
    })
  }
  
  exports.getArrayFromFirebaseData = (object_data) =>{
    return new Promise((resolve,reject)=>{
      var keys = Object.keys(object_data);
      var array_of_productdesigns = []
      
      for(var i = 0; i < keys.length; i++){
        var key = keys[i];
        array_of_productdesigns.push(object_data[key]);
      }
      resolve(array_of_productdesigns);
  
    });
  }
  