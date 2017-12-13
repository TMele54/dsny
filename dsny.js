var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var router = express.Router();

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
//app.use('/bower_components',  express.static(__dirname + '../bower_components'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/python_modules',  express.static(__dirname + '/python_modules'));
app.use('/public',  express.static(__dirname + '/public'));
app.use('/users', users);

var data = require('./python_modules/data/collegeScorecard/filteredData.json');


////////////////////////////////////////////////////////////////////////////////////////////////Email
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "DataScienceNewYork@Gmail.com",
        pass: "Rutgers54"
    }
});
app.get('/send',function(req,res){
    var mailOptions={
        to : "DataScienceNewYork@Gmail.com",
        subject : req.query.subject,
        text : req.query.text+"       "+req.query.to
    };

    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.end("error");
        }else{
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////Home Page
app.get('/', function(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '/views') });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////Portfolio
app.get('/portfolio', function(req, res) {
    res.sendFile('portfolio.html', { root: path.join(__dirname, '/views') });
});

//////////////////////////////////////////College Scorecard
app.get('/portfolio/college-scorecard-dashboard', function(req, res) {
    res.sendFile('college-scorecard-dashboard.html', { root: path.join(__dirname, '/views') });
});


app.get('/portfolio/college-scorecard-dashboard-slim', function(req, res) {
    res.sendFile('college-scorecard-dashboard-slim.html', { root: path.join(__dirname, '/views') });
});

app.get('/college-scorecard-dashboard-data', function(req, res) {
    //var rawdata = fs.readFileSync('python_modules/data/collegeScorecard/filteredData.json');
    var data = require('./python_modules/data/collegeScorecard/filteredData.json');
    res.send(JSON.stringify(data));
});

app.get('/college-scorecard-dashboard-data-slim', function(req, res) {
    //var rawdata = fs.readFileSync('python_modules/data/collegeScorecard/filteredData.json');
    var data = require('./python_modules/data/collegeScorecard/filteredDataSlim.json');
    res.send(JSON.stringify(data));
});

/////////////////////////////////////////////////////////////////////////////////////////////////////


var listener = app.listen(8054, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});









// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});






module.exports = router;
