const crypto = require('crypto');
const utilities ={};
const environments = require('./environments')


// handling error for the real data

utilities.parseJson = (jsonData) => {

    let output;
    try{
        output = JSON.parse(jsonData);
    } catch{
        output = jsonData;
    }

    return output;
};

// hashing password
utilities.hash = (str) => {

   if(typeof(str)=== 'string' && str.length>0){
        const hash = crypto
        .createHmac('sha256', environments.secretKey)
        .update(str)
        .digest('hex');
        return hash;
   } else return false;
};

module.exports = utilities;