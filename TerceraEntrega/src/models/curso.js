const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Estudiante = require('./estudiante');

const Schema = mongoose.Schema;
const cursoSchema = new Schema({
    id : {
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
	modalidad :{
		type : String,
		required : true
	},
	valor : {
		type: String,
		required : true
		
	},
	descripcion : {
		type: String,
		required : true			
    },
    intensidad : {
		type: String,
		required : true			
    },
    estado : {
		type: String,
		required : true			
    },

    estudiantes: [{ type: Schema.Types.ObjectId, ref: 'Estudiante' }]
});

cursoSchema.plugin(uniqueValidator);

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso