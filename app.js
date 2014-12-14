"use strict";
var express = require('express');
var app = express();
var routes = require('./routes');
var http = require('http').Server(app);
var path = require('path');

var acronyms = require('./routes/acronyms'); 

var io = require('socket.io')(http, {path: '/acronyms/socket.io'});


// var connection  = require('express-myconnection'); 


app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use("/acronyms",express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



// app.use(connection(mysql, dbinfo, 'single'));

function nocache(req, res, next) {
  res.header('Cache-Control', 'no-cache');
  next();
}

app.get('/', function(req, res) { res.redirect(302, '/acronyms'); });
app.get('/acronyms', nocache, acronyms.route_list);
app.get('/acronyms/add', nocache, acronyms.add);
app.post('/acronyms/add', nocache, acronyms.save);
app.get('/acronyms/delete/:id', nocache, acronyms.delete_acronym);
app.get('/acronyms/edit/:id', nocache, acronyms.edit);
app.post('/acronyms/edit/:id',nocache,acronyms.save_edit);


app.use(app.router);

http.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



console.log(app.get('mysql'));
io.on('connection', function(socket) { 
  console.log("connection ", socket.id);
  
  acronyms.list(function(err, data) {
    if(err) {
      socket.emit('err', err);
    } else {
      socket.emit('data', data);
    }
  });

  socket.on('disconnect', function() {
    console.log("disconnect "+socket.id);
  });
  socket.on('error', function(e) {
    console.log("error " + e);
  })
  socket.on('data', function(msg) {
    console.log("message " + msg);
    acronyms.list(function(err, data) {
      if(err) {
        socket.emit('err', err);
      } else {
        socket.emit('data', data);
      }
    });
  });
});
