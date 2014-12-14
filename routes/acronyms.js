var mysql = require('mysql');
var dbinfo = {
        host: 'localhost',
        user: 'acronymuser',
        password : 'acronympass',
        port : 3306, 
        database:'acronym'
    };

var connection = mysql.createConnection(dbinfo);
connection.connect();

var database;
connection.query('SELECT id, acronym, meaning, URL as url FROM acronym WHERE active = 1 ORDER BY UPPER(acronym)', function(err, data) {
  database = data;
  console.log("Starting records:"+data.length);
});

function list(callback) {
  callback(undefined, database);
};
exports.list = list;

exports.route_list = function(req, res){
  list(function(err,rows) {
    if(err) {
      console.log("Error Selecting : %s ",err );
    } else {
      res.render('acronyms',{page_title:"Acronyms",data:rows});
    }          
  });
};

exports.add = function(req, res){
  res.render('add_acronym',{page_title:"Add Acronyms"});
};

exports.edit = function(req, res){
    
  var id = req.params.id;
  
  var query = connection.query('SELECT id, acronym, meaning, URL as url FROM acronym WHERE id = ?',[id],function(err,rows)
  {
      
      if(err)
          console.log("Error Selecting : %s ",err );

      res.render('edit_acronym',{page_title:"Edit Acronym",data:rows});
          
     
   });
};

/*Save the acronym*/
exports.save = function(req,res){
    
  var input = JSON.parse(JSON.stringify(req.body));

      
  var data = {
      
      acronym : input.acronym,
      meaning : input.meaning,
      url     : input.url
  
  };
  
  var query = connection.query("INSERT INTO acronym set ? ",data, function(err, rows)
  {

    if (err)
      console.log("Error inserting : %s ",err );

    console.log("inserting ", data, rows);
    if(rows && rows.affectedRows > 0) {
      data.id = rows.insertId;
      database.push(data);
    }
    res.redirect('/acronyms');
    
  });
};

exports.save_edit = function(req,res){
    
  var input = JSON.parse(JSON.stringify(req.body));
  var id = req.params.id;
      
  var data = {
      
      acronym    : input.acronym,
      meaning : input.meaning,
      url   : input.url
  
  };
  for(var i = 0; i < database.length; i++) {
    console.log(database[i]);
    if(id == database[i].id) {
      database.splice(i, 1);
      console.log("Removing the previous " + id);
    }
    break;
  }
  connection.query("UPDATE acronym set ? WHERE id = ? ",[data,id], function(err, rows) {
    if (err) {
      console.log("Error Updating : %s ",err );
    }
    if(rows && rows.affectedRows>0) {
      data.id = id;
      database.push(data);
    }
    res.redirect('/acronyms');
  });
};


exports.delete_acronym = function(req,res){
  var id = req.params.id;
  for(var i = 0; i < database.length; i++) {
    if(id == database[i].id) {
      database.splice(i, 1);
    }
    break;
  }

  connection.query("UPDATE acronym SET active = 0 WHERE id = ? ",[id], function(err, rows)
  {
      
       if(err)
           console.log("Error deleting : %s ",err );
      
       res.redirect('/acronyms');
       
  });
};


