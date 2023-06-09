// const http = require('http');
// const path = require('path');
// const fs = require('fs');
// const fsPromises = require('fs').promises;

// const logEvents = require('./logEvents');
// const EventEmitter = require('events');
// class Emitter extends EventEmitter { };
// // initialize object 
// const myEmitter = new Emitter();
// myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
// const PORT = process.env.PORT || 3500;

// const serveFile = async (filePath, contentType, response) => {
//     try {
//         const rawData = await fsPromises.readFile(
//             filePath,
//             !contentType.includes('image') ? 'utf8' : ''
//         );
//         const data = contentType === 'application/json'
//             ? JSON.parse(rawData) : rawData;
//         response.writeHead(
//             filePath.includes('404.html') ? 404 : 200,
//             { 'Content-Type': contentType }
//         );
//         response.end(
//             contentType === 'application/json' ? JSON.stringify(data) : data
//         );
//     } catch (err) {
//         console.log(err);
//         myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
//         response.statusCode = 500;
//         response.end();
//     }
// }

// const server = http.createServer((req, res) => {
//     console.log(req.url, req.method);
//     myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

//     const extension = path.extname(req.url);

//     let contentType;

//     switch (extension) {
//         case '.css':
//             contentType = 'text/css';
//             break;
//         case '.js':
//             contentType = 'text/javascript';
//             break;
//         case '.json':
//             contentType = 'application/json';
//             break;
//         case '.jpg':
//             contentType = 'image/jpeg';
//             break;
//         case '.png':
//             contentType = 'image/png';
//             break;
//         case '.txt':
//             contentType = 'text/plain';
//             break;
//         default:
//             contentType = 'text/html';
//     }

//     let filePath =
//         contentType === 'text/html' && req.url === '/'
//             ? path.join(__dirname, 'views', 'index.html')
//             : contentType === 'text/html' && req.url.slice(-1) === '/'
//                 ? path.join(__dirname, 'views', req.url, 'index.html')
//                 : contentType === 'text/html'
//                     ? path.join(__dirname, 'views', req.url)
//                     : path.join(__dirname, req.url);

//     // makes .html extension not required in the browser
//     if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

//     const fileExists = fs.existsSync(filePath);

//     if (fileExists) {
//         serveFile(filePath, contentType, res);
//     } else {
//         switch (path.parse(filePath).base) {
//             case 'old-page.html':
//                 res.writeHead(301, { 'Location': '/new-page.html' });
//                 res.end();
//                 break;
//             case 'www-page.html':
//                 res.writeHead(301, { 'Location': '/' });
//                 res.end();
//                 break;
//             default:
//                 serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
//         }
//     }
// });
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// const express = require('express')
// const app = express();
// const path = require('path')
// const cors = require('cors');
// const PORT = process.env.PORT || 3500;
// const {logEvents, logger} = require('./middleware/logEvents');
// const errorHandler = require('./middleware/errorHandler');



// // app.get('/', (req, res) => {
// //     res.setHeader('Access-Control-Allow-Origin', 'https://www.google.com');
// //     res.send('Hello, world!');
// //   });
  
// // Cross Origin Resource Sharing
// const whitelist = ['https://codelogistics.com', 'http://127.0.0.1:5500', 'http://127.0.0.1:3500']
// const corsOptions = {
//     origin: (origin, callback) => {
//         if(whitelist.indexOf(origin) !== -1 || !origin){
//         callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     },
//     optionSuccessStatus: 200
// }
// app.use(cors(corsOptions));


// // custom middleware logger

// app.use(logger);

// // built-in middleware to handle urlencoded requests data
// app.use(express.urlencoded({ extended: false }));

// //built-in middleware to handle json
// app.use(express.json());

// app.use(express.static(path.join(__dirname, '/public')));

// app.use('/subdir',express.static(path.join(__dirname, '/public')));

// app.use('/', require('routes/root'))
// app.use('/subdir', require('./routes/subdir'));




// //Route handlers
// app.get('/hello(.html)?', (req, res, next) => {
//     console.log("Attempted to load hello.html")
//     next()
// }, (req, res) => {
//     res.send("Hello, world!");
// })   


// const one = (req, res, next) => {
//     console.log("one");
//     next();
// }
// const two = (req, res, next) => {
//     console.log("two");
//     next();
// }
// const three = (req, res) => {
//     console.log("three");
//     res.send("Finished");
// }

// app.get('/chain(.html)?', [one, two, three])

// app.all('*', (req, res) => {
//     res.status(404);
//     if (req.accepts('html')) {
//         res.sendFile(path.join(__dirname, 'views', '404.html'))
//     }
//     else if (req.accepts('json')) {
//         res.json({error: "404 Not found"})
//     }
//     else {
//         res.type('txt').send("404 Not found");
//     }
   
// });

// app.use(errorHandler)

// app.listen(PORT, () => {
//     console.log("server listening on port " + PORT)
// })