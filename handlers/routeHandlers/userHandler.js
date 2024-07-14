// dependencies
const data = require ('../../lib/data');
const{hash} = require('./../../helpers/utilities') ;
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

handler._users.get = (requestProperties, callback) => {};

handler._users.put = (requestProperties, callback) => {};

handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
