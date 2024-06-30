// module sccafolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {

    callback(200,{
        "message": "Hello World"
    });
    //console.log("sampleHandler.handle()");
};

module.exports = handler;