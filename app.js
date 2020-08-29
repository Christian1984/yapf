const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const planesRouter = require('./routes/planes');
const airportsRouter = require('./routes/airports');
const usersRouter = require('./routes/users');

const ICAOS = require('./routes/utils/icaos');
const fs = require('fs');

const app = express();

const port = 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/planes', planesRouter);
app.use('/airports', airportsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

app.listen(port, () => {
    console.log(`YAPF listening at http://localhost:${port}`)
});

/*
const icaos2 = ICAOS.map(el => ({icao: el.icao,lat: el.lat,lon: el.lon,latRad: el.lat * (Math.PI / 180),lonRad: el.lon * (Math.PI / 180),latSin: Math.sin(el.lat * (Math.PI / 180)),lonSin: Math.sin(el.lon * (Math.PI / 180)),latCos: Math.cos(el.lat * (Math.PI / 180)),lonCos: Math.cos(el.lon * (Math.PI / 180))}));
console.log(ICAOS[0], icaos2[0]);

const icaos2string = JSON.stringify(icaos2);
const icaos2unquoted = icaos2string.replace(/"([^"]+)":/g, '$1:');

fs.writeFileSync("icaos.json", icaos2unquoted);
console.log("File saved!"); 
*/

module.exports = app;
