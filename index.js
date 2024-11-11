// import http from "http";
const http = require('http');
// import application from "./src/config/express.config";
const application = require('./src/config/express.config')

// optional only if you need to pass something from command to your server

// process 
const args = process.argv.splice(2) || null;
// one time setup 
let port = 9005;
let host = '127.0.0.1';

if(args.length) {
    // 
    args.map((str) => {
        // =
        const [key, value] = str.split("=")
        if(key === 'host') {
            host = value
        } else if (key === 'port') {
            port = value
        }
    })
}

// node server instance
const appServer = http.createServer(application);

// TODO: Refactor
appServer.listen(port, host, (err) =>{
    if(!err) {
        console.log("Server is running on port: ", port)
        console.log("Press CTRL+C to disconnect server...")
    } else {
        console.log(err);
    }
})