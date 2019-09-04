const PORT = process.env.port || 8081;
const fs = require('fs');

// express
var compression = require('compression');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

// mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/inmobiliaria';
mongoose.connect(mongoDB, {
    useCreateIndex: true,
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// middlewares compress all responses & parse application/json
app.use(compression());
app.use(bodyParser.json());

// middleware log to console all request
app.use((req, res, next) => {
    console.log(`${req.method}: ${req.path}`);
    next();
});

// inicio web (no app)
app.get('/', (req, res, next) => {
    var file = 'README.md';
    file = fs.existsSync(file) ? file : '../' + file;
    let archivo = fs.readFileSync(file, 'utf-8');
    res.send(archivo);
    //next();
});

// middleware api routes
app.use('/api', require('./routes/routes'));

// middleware for others routes and verbs
app.all('/*', function (req, res, next) {
    res.status(501).send('Not Implemented yet');
    return (next);
});

// start the engine
app.listen(PORT, () => {
    console.log(`Server listen on ${PORT}`);
});