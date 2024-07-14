const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../route');
const {notFoundHandler} = require('../handlers/routeHandlers/notFoundHandler');
const {parseJson} =require('../helpers/utilities')

// module scaffolding
const handler = {};

handler.handleReqRes = (req,res) => {
    // pathname handling
   // console.log(req);
   // console.log(res);
    const parsedUrl = url.parse(req.url,true);
    //console.log(parsedUrl);
    
    // req handling
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    //console.log(trimmedPath);
    const method = req.method.toLowerCase();
    // console.log(method);
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject
    }

    const decoder = new StringDecoder('utf-8');
    let realData ='';

    
    const chosenHandler = routes[trimmedPath] ?  routes[trimmedPath] : notFoundHandler;



    req.on('data',(Buffer)=>{
        realData +=decoder.write(Buffer);
    })
    //console.log(headersObject);
    // response handling
    req.on('end',()=> { 
        realData += decoder.end();
        requestProperties.body = parseJson(realData);


        chosenHandler(requestProperties,(statusCode , payload) => {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
            payload = typeof(payload) === 'object' ? payload : {};
    
            const payloadString = JSON.stringify(payload);
    
            // return the final res
            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
        });

        //res.end('hello world');
    });
};

module.exports = handler;