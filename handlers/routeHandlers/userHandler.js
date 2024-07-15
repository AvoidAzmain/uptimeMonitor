// dependencies
const data = require ('../../lib/data');
const{hash} = require('../../helpers/utilities') ;
const{parseJson} = require('../../helpers/utilities')
// module sccafolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    return callback(405);
  }
  //console.log("sampleHandler.handle()");
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" 
      ? requestProperties.body.tosAgreement
      : false;


      if(firstName && lastName && phone && tosAgreement) {
        // make sure that the user doesnt already exist
        data.read('users',phone,(err,user) =>{
            if(err){
                //porer kaj and user k dhukai dbo
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password:hash(password),
                    tosAgreement,
                };
                // store the user to db
                data.create('users',phone,userObject,(err2)=>{
                    if(!err2){
                        callback(200,{message:'internal server error'});
                    }
                    else {
                        callback(500, {error: 'could not create user', });
                    }
                })

            } else { 
                callback(500,
                    {
                        error:'there is a server side issue',
                    }
                )
            }
        });


      } else {
        callback(400, {
            error: 'you have problem in request',
        })
      }
};

handler._users.get = (requestProperties, callback) => {
    // check the phone number is valid or not
    const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

      if(phone){
        // lookup the user 
        data.read('users',phone,(err,u) =>{
            if(!err && u){
                const user ={...parseJson(u)};
                // remove the hashed password from the user object before returning it to the client
                delete user.password;
                callback(200, user);
            }
            else {
                callback(404,{
                    error:'phone number is not valid 222',
                })
            }
        })
      }else{
        callback(404,{
            error:'phone number is not valid',
        })
      }
};

handler._users.put = (requestProperties, callback) => {
    const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;


      if(phone){
        if(firstName|| lastName || password){
            data.read('users',phone,(err,uData)=>{
                const userData = {...parseJson(uData)};
                if(!err && userData){
                    if(firstName){
                        userData.firstName = firstName;
                    }

                    if(lastName){
                        userData.lastName = lastName;
                    }

                    if(password){
                        userData.password = hash(password);
                    }

                    //store to the file
                    data.update('users',phone,userData,(err2)=>{
                        if(!err2){
                            callback(200,{error: 'user updated'});
                        }else{
                            callback(500,{error: 'server side issue'});
                        }
                    })
                }else{
                    callback(404,{error: 'you have problem in your input'});
                }
            })
        }else{
            callback(404,{error: 'check your data again'});
        }
      }else{
        callback(404,{error: 'invalid phone number'});
      }

};

handler._users.delete = (requestProperties, callback) => {
    const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

      if(phone){
        data.read('users',phone,(err,userData)=>{
            if(!err && data){
                data.delete('users',phone,(err2)=>{
                    if(!err2){
                        callback(200,{error: 'user deleted'});
                    }else{
                        callback(500,{error: 'server side issue'});
                    }
                })
            }
            else{
                callback(500,{error: 'server side error'});
            }
        })
      }else {
        callback(404,{error: 'invalid phone number'});
      }
};

module.exports = handler;
