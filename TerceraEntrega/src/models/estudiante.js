const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Curso = require('./estudiante');

const Schema = mongoose.Schema;
const estudianteSchema = new Schema({
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
	}
	,
    cursos: [{ type: Schema.Types.ObjectId, ref: 'Curso' }]
});

estudianteSchema.plugin(uniqueValidator);

const Estudiante = mongoose.model('Estudiante', estudianteSchema);

module.exports = Estudiante


