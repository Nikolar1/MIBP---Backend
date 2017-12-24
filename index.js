var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
const port = 3000;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/profesori');
var db = mongoose.connection;
var app = express();
var profesor = require('./model/sema');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
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
});

app.get('/profesori/dodaj', function(req, res){
  res.render('dodaj',{
    title:'Dodaj Profesora'
  });
});

app.post('/profesori/dodaj',  function(req, res){
  var noviprofesor = new profesor();
  noviprofesor.ime = req.body.ime;
  noviprofesor.prezime = req.body.prezime;
  noviprofesor.Mestoboravka = req.body.Mestoboravka;
  noviprofesor.likes = 0;
  noviprofesor.dislikes = 0;
  noviprofesor.ocena = req.body.ocena;
  noviprofesor.save(function(err){
    if(err){
      console.log(err);
      return;
    }else{
      res.redirect('/');
    }

  });
});

app.get('/profesori/:id', function(req,res){
  profesor.findById(req.params.id, function(err, nadjprofesor){
    res.render('nadjeni',{
      nadjprofesor:nadjprofesor
    });
  });
});

app.get('/profesori/komentar/:id', function(req,res){
  profesor.findById(req.params.id, function(err, nadjprofesor){
    res.render('Komentarisi',{
      title:'Komentarisi',
      nadjprofesor:nadjprofesor
    });
  });
});
//Komentarisi----------------------------------------------------------------------------------------------
app.post('/profesori/komentar/:id',  function(req, res){
  var komentar = {};
  var adresa = {_id:req.params.id}
  komentar.komentari.komentar.autor=req.body.autor;
  komentar.komentari.komentar.tekst=req.body.tekst;

  profesor.update(adresa, komentar,function(err){
  		if (err) {
  			console.log(err);
  		}else{
          		res.redirect('/');
      }
  	});

  });

  app.get('/profesori/edit/:id', function(req,res){
    profesor.findById(req.params.id, function(err, nadjprofesor){
      res.render('edit',{
        title:'Edit',
        nadjprofesor:nadjprofesor
      });
    });
  });

  app.post('/profesori/edit/:id',  function(req, res){
    var noviprofesor = {};
    var adresa = {_id:req.params.id}
    noviprofesor.ime = req.body.ime;
    noviprofesor.prezime = req.body.prezime;
    noviprofesor.Mestoboravka = req.body.Mestoboravka;
    noviprofesor.likes = 0;
    noviprofesor.dislikes = 0;
    noviprofesor.ocena = req.body.ocena;
    profesor.update(adresa, noviprofesor, function(err){
      if(err){
        console.log(err);
        return;
      }else{
        res.redirect('/');
      }

    });
  });



  app.delete('/profesori/:id', function(req, res){
          var adresa = {"_id": req.params.id}
          profesor.findOneAndRemove(adresa, function(err) {
              if(err){
                console.log(err);
              }else{
                res.send('Success');
              }
          });
      });



app.listen(port);
