const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path');
require('dotenv').config();

const Route = require('./routes/route.js');

const config = require('./config.js');

const MONGODB_URI = config.mongodburi || 'mongodb://localhost:27017/Supboard';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (error) => {
    console.log(error);
});

let app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(session({
    secret: config.jwtSecret,
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'client/build')));

global.appRoot = path.resolve(__dirname);

// routing
app.use('/api', Route);
// end routing


app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});

