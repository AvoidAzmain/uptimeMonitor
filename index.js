// dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes')
const environment = require('./helpers/environments');
const data = require('./lib/data');


// app object - model scaffolding
const app = {};
data.create('text','newFile',{name:'Bangladesh'},(err)=>{
    if(!err){
        console.log('data saved');
    }
})

//create server 
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    //console.log(process.env)
    server.listen(environment.port,()=> {
         console.log(`listening to port ${environment.port}`);
    });
};


app.handleReqRes = handleReqRes;

// start server
app.createServer();

