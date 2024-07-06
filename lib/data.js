// dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

//base directory of the data folder
lib.basedir = path.join(__dirname, './../.data/');
module.exports= lib;

// write data to file
lib.create = function(dir, file, data, callback){
    //open the file for writing
    fs.open(`${lib.basedir+dir}/${file}.json` , 'wx' , (err,filedescriptor)=>{
        if(!err && filedescriptor){
            //convert data to string
            const stringData = JSON.stringify(data);


            //write data to  file and close it 
            fs.writeFile(filedescriptor,stringData,(error)=>{
                if(!error){
                    fs.close(filedescriptor,(error2)=>{
                        if(!error2){
                            callback(false);
                        }
                        else{
                            callback('Error closing new file');
                        }

                    })
                }else{
                    callback(error,null);
                }
            })
        }else{
            callback(err+'couldnt create new file it may already exist! ')
        }
    })
};


module.exports = lib;