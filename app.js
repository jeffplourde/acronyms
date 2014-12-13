var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var acronyms = require('./routes/acronyms'); 
var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

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

app.use(
    
    connection(mysql,{
        
        host: 'localhost',
        user: 'acronymuser',
        password : 'acronympass',
        port : 3306, 
        database:'acronym'

    },'single') //or single

);

function nocache(req, res, next) {
  res.header('Cache-Control', 'no-cache');
  next();
}

app.get('/', routes.index);
app.get('/acronyms', nocache, acronyms.list);
app.get('/acronyms/add', nocache, acronyms.add);
app.post('/acronyms/add', nocache, acronyms.save);
app.get('/acronyms/delete/:id', nocache, acronyms.delete_acronym);
app.get('/acronyms/edit/:id', nocache, acronyms.edit);
app.post('/acronyms/edit/:id',nocache,acronyms.save_edit);


app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
