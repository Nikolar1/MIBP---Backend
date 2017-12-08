const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Profesor = new Schema({
	ime: {
		type: String,
		required: true
	},
	prezime: {
		type: String,
		required: true
	},
	ocene: {
		type: [Number]
		required: true,
		pattern : '[1-5]{1}'
	},
	komentari: [{
		user: {
			type: String,
			required: true
		},
		tekst: {
			type: String,
			required: true,
		},
		likes : {
			type : Number,
			required : true,
			min : 0
		},
		dislikes : {
			type : Number,
			required : true,
			min : 0
		}
	}],
}, {collection: 'profesor'});

var profesori = mongoose.model('profesori', profesoriSchema);

module.exports = profesori;