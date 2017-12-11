var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sema = new Schema({
    ime : {
        type : String,
        required : true
    },
    prezime : {
        type : String,
        required:true
    },
    Mestoboravka : {
        type : String,
        required : true
    },
    komentari : [
      {
          komentar : [
            {
              autor : {
                type : String,
                required : true
              },
              tekst : {
                type : String,
                required : true
              }
            }
          ]
      }
    ],
    likes : {
      type : Number,
      min : 0
    },
    dislikes : {
      type : Number,
      min : 0
    }
}, {collection: 'profesori'});

var profesori = mongoose.model('profesori', Sema);
module.exports = profesori;
