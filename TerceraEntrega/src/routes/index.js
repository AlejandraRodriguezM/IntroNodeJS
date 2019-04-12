const express = require('express')
const app = express ()
const path = require('path')
const hbs = require ('hbs')
const Estudiante = require('./../models/estudiante')
const Curso = require('./../models/curso')
// const dirViews = path.join(__dirname, '../../template/views')
// const dirPartials = path.join(__dirname, '../../template/partials')
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');



let flag=true;
let flagEstudianteInscrito=true;

app.get('/', (req,res)=>{
    res.render('index')

})

//para que el coordinador registre un nuevo curso
app.get('/crearcurso', (req,res)=>{
    res.render('crearcurso',{
        flag_crearcurso:flag
    })
    if (!flag){
        flag=true
    }
})

app.post('/crearcurso', (req,res)=>{

    let curso=new Curso ({
        id:req.body.Idcurso,
        nombre:req.body.Nombrecurso,
        modalidad:req.body.Modalidad,
        valor:req.body.Valor,
        descripcion:req.body.Descripcion,
        intensidad:req.body.Intensidad,
        estado:'disponible'
    })

    curso.save((err, resultado) => {
		if (err){
            flag=false
            return res.redirect('/crearcurso'); 
             
        }	
        res.redirect('/listarcursoscoord')
        flag=true 	
		
	})		

})

//para listar cursos por parte del coordinador
//y cambiar el estado de un curso
app.get('/listarcursoscoord', (req,res)=>{

    Curso.find({},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

		res.render ('listarcursoscoord',{
			listCursos : respuesta
		})
	})

})

app.post('/listarcursoscoord', (req,res)=>{ ///PROBLEMA!!!!!!!!!!
    //funciones.listarCursos()
   //let idcurso=req.body.idcurso
   //funciones.cambiarEstadoCurso(idcurso) 
   
   Curso.findOneAndUpdate({id : req.body.idcurso}, {$set: {"estado": 'disponible'}}, { runValidators: true, context: 'query' }, (err, resultados) => {
        if (err){
            return console.log(err)
        }

        // Curso.find({},(err,respuesta)=>{
        //     if (err){
        //         return console.log(err)
        //     }
    
            res.render ('listarcursoscoord',{
                listCursos : resultados,
                flag:true
            })
        // })
       
    })	



 })

//para ver la lista de cursos con estado disponible
app.get('/cursosdisponibles', (req,res)=>{

    Curso.find({estado:'disponible'},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

        let flag_cursos=true

        if(respuesta.length == 0){
            flag_cursos=false
        }
		res.render ('cursosdisponibles',{
            listCursos : respuesta,
            flagcurso:flag_cursos
		})
	})
    
    
})

// //para que un estudiante se inscriba en un curso
app.get('/inscribir', (req,res)=>{
    //cursosDisponibles=funciones.listarCursosDisponibles()
   
    Curso.find({estado:'disponible'},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

        let flag_cursos=true

        if(respuesta.length == 0){
            flag_cursos=false
        }
        
		res.render ('inscribir',{
            listCursos : respuesta,
            flagEstudianteInscrito:flagEstudianteInscrito,
            flagcurso:flag_cursos
		})
	})
 
})

app.post('/inscribir', (req,res)=>{
    
    //la persona selecciona el curso y en el body llega el id correspondiente
    let curso=req.body.curso_id

    let estudiante=new Estudiante ({
        documento:req.body.documento,
        nombre:req.body.nombre,
        correo:req.body.correo,
        telefono:req.body.telefono,
        cursos:[curso]
    })
    

    estudiante.save((err, resultado) => {
		if (err){
            //return res.redirect('/inscribir')
            
           return console.log(err)   
        }	
       
        res.redirect('/fininscripcion')
        	
		
	})		

    //flagEstudianteInscrito=funciones.crearEstudiante(registroestudiante,curso)

   
    
})


// //para mostrar info registrada por el estudiante cuadno se inscribió
// app.get('/fininscripcion', (req,res)=>{
//     funciones.listarCursos()
//     let ultimoCursoEstudiante=funciones.getUltimoCursoEstudiante()
   
//     res.render('fininscripcion',{
//         infoestudiante:[ultimoCursoEstudiante]
        
//     })
// })

// //para ver los estudiantes inscritos en cada curso
// //e igualmente se pueden eliminar los estudiantes
// app.get('/verinscritos', (req,res)=>{

//     funciones.listarCursos()
    
//     res.render('verinscritos',{
//         listCursos:listaCursos
//     })
// })

// app.post('/verinscritos', (req,res)=>{
    
//     funciones.listarCursos()
//     let todelete=req.body.deleteestudiante //desde el formulario retorna idcurso-documentoestudiante
//     funciones.eliminarEstudiante(todelete)
  
//     res.render('verinscritos',{
//         listCursos:listaCursos,
//         flag:true
//     })
// })




module.exports = app