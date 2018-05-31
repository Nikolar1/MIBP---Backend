var mongoose = require('mongoose');

var Sema = mongoose.Schema({
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
    ocena : {
      type : Number,
      required : true
    },
    komentari : [
            {
              autor : {
                type : String,
                required : true
              },
              tekst : {
                type : String,
                required : true
              },
              likes : {
                type : Number,
                min : 0
              },
              dislikes : {
                type : Number,
                min : 0
              }
            }

    ]
}, {collection: 'Profesori'});

var profesori = module.exports = mongoose.model('Profesori', Sema);
