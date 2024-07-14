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

lib.read =(dir,file,callback)=>{
    fs.readFile(`${lib.basedir+dir}/${file}.json`,'utf-8',(err,data)=>{
        callback(err,data);
    });
};

lib.update =(dir,file,data,callback) => {
    //open the file for writing
    fs.open(`${lib.basedir+dir}/${file}.json`,'r+',(err,filedescriptor)=>{
        if(!err && filedescriptor){
            //convert data to string
            const stringData = JSON.stringify(data);
            fs.ftruncate(filedescriptor,(error)=>{
                if(!error){
                    //write data to  file and close it
                    fs.writeFile(filedescriptor,stringData,(error2)=>{
                        console.log(filedescriptor)
                        if(!error2){
                            fs.close(filedescriptor,(error3)=>{
                                if(!error3){
                                    callback(false);
                                }

                                else{
                                    callback('Error closing file');
                                }
                            })
                        }
                        else{
                            callback('Error writing to file');
                        }
                    })
                }else{
                    console.log(error)
                }
            })
        }else{
            console.log(err)
        }

    })
}

lib.delete =(dir,file,callback) => {
    fs.unlink(`${lib.basedir+dir}/${file}.json`,(err)=>{
        if(!err){
            callback(false);
        }
        else{
            callback('Error deleting file');
        }
    
});
};
module.exports = lib;