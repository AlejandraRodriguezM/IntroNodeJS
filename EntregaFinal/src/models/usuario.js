const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Curso = require('./curso');

const Schema = mongoose.Schema;
const usuarioSchema = new Schema({

    documento:{
        type : String,
		required : true	,
		trim : true,
		unique: true
    },
	nombre : {
		type : String,
		required : true	,
		trim : true
	},
	password :{
		type : String,
		required : true
	},
	correo : {
		type: String,
        required : true,
        trim : true
		
	},
	telefono : {
		type: String,
        required : true,
        trim : true			
	},

	rol: {
		type: String,
        required : true,
        trim : true			
	},
	 
    fotoperfil:{
		type:Buffer
	},
	extensionfoto:{
		type: String
	}
});

usuarioSchema.plugin(uniqueValidator);

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario


