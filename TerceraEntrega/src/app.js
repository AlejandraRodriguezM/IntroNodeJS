const express=require('express');
const app=express();
const path=require('path');
const hbs=require('hbs');
const bodyParser=require('body-parser')
//const funciones=require('./funciones.1')
const mongoose = require('mongoose');
//const jwt = require('jsonwebtoken');
//const session = require('express-session')
//var MemoryStore = require('memorystore')(session)



//ruta de la carpeta public
const directoriopublico=path.join(__dirname,'../public');
app.use(express.static(directoriopublico));

//ruta de la carpeta partials
const directoriopartials=path.join(__dirname,'../partials');

//hbs
app.set('view engine','hbs');
hbs.registerPartials(directoriopartials);

//body-parser
app.use(bodyParser.urlencoded({extended:false}));


//Routes
app.use(require('./routes/index'));



// Connection URL
const urldb = 'mongodb://localhost:27017/myproject';

mongoose.connect(urldb, {useNewUrlParser: true}, (err, resultado) => {
	if (err){
		return console.log(error)
	}
	console.log("conectado")
});




// let flag=true;
// let flagEstudianteInscrito=true;

// app.get('/', (req,res)=>{
//     res.render('index')

// })

// //para que el coordinador registre un nuevo curso
// app.get('/crearcurso', (req,res)=>{
//     res.render('crearcurso',{
//         flag_crearcurso:flag
//     })
//     if (!flag){
//         flag=true
//     }
// })

// app.post('/crearcurso', (req,res)=>{

//     let curso={
//         id:req.body.Idcurso,
//         nombre:req.body.Nombrecurso,
//         modalidad:req.body.Modalidad,
//         valor:req.body.Valor,
//         descripcion:req.body.Descripcion,
//         intensidad:req.body.Intensidad,
//         estado:'disponible'
//     }
//     flag=funciones.crearCurso(curso)
    
//     if(flag){
//          res.redirect('/listarcursoscoord')
//     }else{
//          res.redirect('/crearcurso');
//     }

// })

// //para listar cursos por parte del coordinador
// //y cambiar el estado de un curso
// app.get('/listarcursoscoord', (req,res)=>{
//     funciones.listarCursos()
    
//     res.render('listarcursoscoord',{
//         listCursos:listaCursos
//     })
// })

// app.post('/listarcursoscoord', (req,res)=>{
//     funciones.listarCursos()
//    let idcurso=req.body.idcurso
//    funciones.cambiarEstadoCurso(idcurso) 
   
//    res.render('listarcursoscoord',{
//         listCursos:listaCursos,
//         flag:true
//     })


// })

// //para ver la lista de cursos con estado disponible
// app.get('/cursosdisponibles', (req,res)=>{
//     cursosDisponibles=funciones.listarCursosDisponibles()
    
//     res.render('cursosdisponibles',{
//         listCursos:cursosDisponibles
//     })
// })

// //para que un estudiante se inscriba en un curso
// app.get('/inscribir', (req,res)=>{
//     cursosDisponibles=funciones.listarCursosDisponibles()
//     console.log(cursosDisponibles.length)
//     let flag_cursos=true
//     if(cursosDisponibles.length == 0){
//         flag_cursos=false
//     }
    
//     res.render('inscribir',{
//         listCursos:cursosDisponibles,
//         flagEstudianteInscrito:flagEstudianteInscrito,
//         flagcurso:flag_cursos
//     })
// })

// app.post('/inscribir', (req,res)=>{
    
//     let registroestudiante={
//         documento:req.body.documento,
//         nombre:req.body.nombre,
//         correo:req.body.correo,
//         telefono:req.body.telefono
//     }
//     let curso=req.body.curso

//     flagEstudianteInscrito=funciones.crearEstudiante(registroestudiante,curso)

//     if(flagEstudianteInscrito){
//         res.redirect('/fininscripcion')
//         console.log('se inscribió')
//     }else{
//         res.redirect('/inscribir')
//         console.log('repetido')
//     }
    
// })


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

const port = process.env.PORT || 3000;
app.listen( port,()=>{
    console.log('Escuchando en el puerto '+port)
})

