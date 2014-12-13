
/*
 * GET acronyms listing.
 */

exports.list = function(req, res){

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT id, acronym, meaning, URL as url FROM acronym WHERE active = 1 ORDER BY UPPER(acronym)',function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('acronyms',{page_title:"Acronyms",data:rows});
                
           
         });
         
         //console.log(query.sql);
    });
  
};

exports.add = function(req, res){
  res.render('add_acronym',{page_title:"Add Acronyms - Node.js"});
};

exports.edit = function(req, res){
    
    var id = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT id, acronym, meaning, URL as url FROM acronym WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('edit_acronym',{page_title:"Edit Acronym",data:rows});
                
           
         });
         
         //console.log(query.sql);
    }); 
};

/*Save the acronym*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            acronym : input.acronym,
            meaning : input.meaning,
            url     : input.url
        
        };
        
        var query = connection.query("INSERT INTO acronym set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/acronyms');
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            acronym    : input.acronym,
            meaning : input.meaning,
            URL   : input.url
        
        };
        
        connection.query("UPDATE acronym set ? WHERE id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/acronyms');
          
        });
    
    });
};


exports.delete_acronym = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("UPDATE acronym SET active = 0 WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/acronyms');
             
        });
        
     });
};


