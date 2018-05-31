var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
const port = 3000;
mongoose.Promise = global.Promise;
var app = express();
var profesor = require('./model/sema');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  mongoose.connect('mongodb://localhost:27017/profesori');
  var db = mongoose.connection;
  profesor.find({}, function(err, profesori){
    if(err){
      console.log(err);
    }
    else{
      res.render('index', {
        title:'Profesori',
        profesori: profesori
      })
    }
  });
  mongoose.connection.close();
});

app.get('/profesori/dodaj', function(req, res){
  res.render('dodaj',{
    title:'Dodaj Profesora'
  });
});

app.post('/profesori/dodaj',  function(req, res){
  mongoose.connect('mongodb://localhost:27017/profesori');
  var db = mongoose.connection;
  var noviprofesor = new profesor();
  noviprofesor.ime = req.body.ime;
  noviprofesor.prezime = req.body.prezime;
  noviprofesor.Mestoboravka = req.body.Mestoboravka;
  noviprofesor.ocena = req.body.ocena;
  var komentar = {};
  komentar.autor=req.body.autor;
  komentar.tekst=req.body.tekst;
  komentar.likes=0;
  komentar.dislikes=0;
  noviprofesor['komentari'].push({"autor":komentar.autor, "tekst":komentar.tekst, "likes":0,"dislikes":0});
  noviprofesor.save(function(err){
    if(err){
      console.log(err);
      return;
    }else{
      res.redirect('/');
    }

  });
  db.close();
});

app.get('/profesori/:id', function(req,res){
  mongoose.connect('mongodb://localhost:27017/profesori');
  var db = mongoose.connection;
  profesor.findById(req.params.id, function(err, nadjprofesor){
    res.render('nadjeni',{
      nadjprofesor:nadjprofesor
    });
  });
  db.close();
});

app.get('/profesori/komentar/:id', function(req,res){
  mongoose.connect('mongodb://localhost:27017/profesori');
  var db = mongoose.connection;
  profesor.findById(req.params.id, function(err, nadjprofesor){
    res.render('Komentarisi',{
      title:'Komentarisi',
      nadjprofesor:nadjprofesor
    });
  });
  db.close();
});
//Komentarisi----------------------------------------------------------------------------------------------
app.post('/profesori/komentar/:id',  function(req, res){
  mongoose.connect('mongodb://localhost:27017/profesori');
  var db = mongoose.connection;
  profesor.findById(req.params.id, function(err, nadjprofesor){
  var komentar = {};
  var adresa = {_id:req.params.id}
  komentar.autor=req.body.autor;
  komentar.tekst=req.body.tekst;
  komentar.likes=0;
  komentar.dislikes=0;
  nadjprofesor['komentari'].push({"autor":komentar.autor, "tekst":komentar.tekst, "likes":0,"dislikes":0});
  profesor.update(adresa, nadjprofesor,function(err){
  		if (err) {
  			console.log(err);
  		}else{
              db.close();
          		res.redirect('/');
      }
  	});
    });

  });

  app.get('/profesori/edit/:id', function(req,res){
    mongoose.connect('mongodb://localhost:27017/profesori');
    var db = mongoose.connection;
    profesor.findById(req.params.id, function(err, nadjprofesor){
      res.render('edit',{
        title:'Edit',
        nadjprofesor:nadjprofesor
      });
    });
  db.close();
  });

  app.post('/profesori/edit/:id',  function(req, res){
    mongoose.connect('mongodb://localhost:27017/profesori');
    var db = mongoose.connection;
    var noviprofesor = {};
    var adresa = {_id:req.params.id}
    noviprofesor.ime = req.body.ime;
    noviprofesor.prezime = req.body.prezime;
    noviprofesor.Mestoboravka = req.body.Mestoboravka;
    noviprofesor.ocena = req.body.ocena;
    profesor.update(adresa, noviprofesor, function(err){
      if(err){
        console.log(err);
        return;
      }else{
        res.redirect('/');
      }

    });
  db.close();
  });

  app.get('/profesori/oceni/:id', function(req,res){
    mongoose.connect('mongodb://localhost:27017/profesori');
    var db = mongoose.connection;
     profesor.findById(req.params.id, function(err, nadjprofesor){
       res.render('oceni',{
         title:'Oceni',
         nadjprofesor:nadjprofesor
       });
     });
  db.close();
   });

  app.post('/profesori/oceni/:id',  function(req, res){
    mongoose.connect('mongodb://localhost:27017/profesori');
    var db = mongoose.connection;
     profesor.findById(req.params.id, function(err, nadjprofesor){

    var noviprofesor = {};
     var adresa = {_id:req.params.id}
     noviprofesor.ocena = req.body.ocena;
     nadjprofesor.ocena = (parseInt(nadjprofesor.ocena,10) + parseInt(noviprofesor.ocena,10))/2;
     profesor.update(adresa, nadjprofesor, function(err){
       if(err){
         console.log(err);
         return;
       }else{
         db.close();
         res.redirect('/');
       }
       });
     });
   });

   app.post('/profesori/like/:id/:i', function(req,res){
     mongoose.connect('mongodb://localhost:27017/profesori');
     var db = mongoose.connection;
     var adresa = {_id:req.params.id}
      profesor.findById(req.params.id, function(err, nadjprofesor){
        nadjprofesor['komentari'][req.params.i].likes = parseInt(nadjprofesor['komentari'][req.params.i].likes) + 1;
        profesor.update(adresa, nadjprofesor, function(err){
          if(err){
            console.log(err);
            return;
          }else{
            res.redirect('/profesori/'+req.params.id);
            db.close();
          }
      });
    });
      });


      app.post('/profesori/dislike/:id/:i', function(req,res){
        mongoose.connect('mongodb://localhost:27017/profesori');
        var db = mongoose.connection;
        var adresa = {_id:req.params.id}
         profesor.findById(req.params.id, function(err, nadjprofesor){
           nadjprofesor['komentari'][req.params.i].dislikes = parseInt(nadjprofesor['komentari'][req.params.i].dislikes) + 1;
           profesor.update(adresa, nadjprofesor, function(err){
             if(err){
               console.log(err);
               return;
             }else{
               res.redirect('/profesori/'+req.params.id);
               db.close();
             }
         });
       });
         });
         app.get('/sortiraj/:id', function(req,res){
           mongoose.connect('mongodb://localhost:27017/profesori');
           var db = mongoose.connection;
           profesor.findById(req.params.id, function(err, nadjprofesor){
             for (var i = 0, len = nadjprofesor['komentari'].length; i < len; i++) {
               for (var j = 0, len = nadjprofesor['komentari'].length; j < len; j++) {
                 if(parseInt(nadjprofesor['komentari'][i].likes,10) > parseInt(nadjprofesor['komentari'][j].likes,10)){
                   var temp = nadjprofesor['komentari'][i].likes;
                   nadjprofesor['komentari'][i].likes = nadjprofesor['komentari'][j].likes;
                   nadjprofesor['komentari'][j].likes = temp;
                 }
               }
             }
             res.render('nadjeni',{
               nadjprofesor:nadjprofesor
             });
           });
           db.close();
         });



  app.delete('/profesori/:id', function(req, res){
    mongoose.connect('mongodb://localhost:27017/profesori');
    var db = mongoose.connection;
          var adresa = {"_id": req.params.id}
          profesor.findOneAndRemove(adresa, function(err) {
              if(err){
                console.log(err);
              }else{
                res.send('Success');
              }
          });
  db.close();
      });



app.listen(port);
