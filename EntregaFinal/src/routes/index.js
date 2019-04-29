const express = require('express')
const app = express ()
const Usuario = require('../models/usuario')
const Curso = require('./../models/curso')
const bcrypt = require('bcrypt');
var assert = require('assert');
const multer=require('multer')
const path=require('path');
require('./../helpers/helpers')
const sgMail = require('@sendgrid/mail');
require('../config/config');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let flag=true;
let flagEstudianteInscrito=true;
let flagRegistroUsuario=true;
let flagCambioEstadoCurso=false;
let flagperfil=false;
var foto_perfil;
var extension;


//funcion para revisar si hay usuario autenticado
function isAuthenticated(req, res, next) {
    
    if (req.session.usuario)
        return next();
  
    res.redirect('/');
  }

  
//Página de inicio
app.get('/', (req,res)=>{
    res.render('index')

})

//cerrar sesion
app.get('/cerrarSesion',  (req,res)=> {
    if (res.locals.sesion) {
      // delete session object
      req.session.destroy((err)=> {
        if (err) return console.log(err) 
        res.redirect('/')		
      });
    }
  });


//para que un usuario se registre en la pagina
app.get('/registro', (req,res)=>{
    res.render('registro_usuario',{
        flag:flagRegistroUsuario
    })

})

app.post('/registro', (req,res)=>{

    let usuario=new Usuario ({
        documento:req.body.documento,
        nombre:req.body.nombre,
        password:bcrypt.hashSync(req.body.contrasena, 10),
        correo:req.body.correo,
        telefono:req.body.telefono,
        rol:"Aspirante",
        fotoperfil:"",
        extensionfoto:''
    })

    usuario.save((err, resultado) => {
		if (err){
            
            flagRegistroUsuario=false
            return res.redirect('/registro'); 
             
        }
        
        flagRegistroUsuario=true 
        
        req.session.usuario = resultado._id	
        req.session.nombre = resultado.nombre
        req.session.rol = resultado.rol

        if (req.session.rol=="Aspirante"){
            res.redirect('/cursosdisponibles')

        }else{ //si es coordinador
            res.redirect('/listarcursoscoord')

            // res.render('listarcursoscoord', {
            //     mensaje : "Bienvenido " + resultados.nombre,
            //     nombre : resultados.nombre,
            //     sesion : true						
            //         })
	
        }
		
	})	


})

//para loguearse en la pagina
app.get('/login', (req,res)=>{
    res.render('login',{
        mensaje:''
    })

})

app.post('/login', (req,res)=>{
    Usuario.findOne({documento : req.body.documento}, (err, resultados) => {
		if (err){
			return console.log(err)
		}
		if(!resultados){
			return res.render ('login', {
			    mensaje : "Usuario no encontrado"			
			})
		}
		if(!bcrypt.compareSync(req.body.contrasena, resultados.password)){
			return res.render ('login', {
			    mensaje : "Contraseña no es correcta"			
			})
        }	
        
        //Para crear las variables de sesión
        req.session.usuario = resultados._id	
        req.session.nombre = resultados.nombre
        req.session.rol = resultados.rol
        req.session.documento = resultados.documento
        
        if (resultados.rol=="Aspirante"){
            res.redirect('/cursosdisponibles')

        }else{ //si es coordinador
            res.redirect('/listarcursoscoord')

            // res.render('listarcursoscoord', {
            //     mensaje : "Bienvenido " + resultados.nombre,
            //     nombre : resultados.nombre,
            //     sesion : true						
            //         })
	
        }

    })        

})

//para que el coordinador registre un nuevo curso
app.get('/crearcurso',isAuthenticated, (req,res)=>{
    if (req.session.rol!="Coordinador"){
        return res.redirect('/');
    }

    res.render('crearcurso',{
        flag_crearcurso:flag
    })

    if (!flag){
        flag=true
    }
})

app.post('/crearcurso',isAuthenticated, (req,res)=>{

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
            console.log(err)
            flag=false
            return res.redirect('/crearcurso'); 
             
        }	
        res.redirect('/listarcursoscoord')
        flag=true 	
		
	})		

})

//para listar cursos por parte del coordinador
//y cambiar el estado de un curso
app.get('/listarcursoscoord',isAuthenticated, (req,res)=>{

    if (req.session.rol!="Coordinador"){
        return res.redirect('/');
    }

    Curso.find({},(err,respuesta)=>{
		if (err){
			return console.log(err)
		}

		res.render ('listarcursoscoord',{
            listCursos : respuesta,
            flag:flagCambioEstadoCurso
        })
        
        if(flagCambioEstadoCurso==true){
            flagCambioEstadoCurso=false
        }
	})

})

app.post('/listarcursoscoord',isAuthenticated, (req,res)=>{ 
   
    var query = Curso.findOne({id : req.body.idcurso})
    assert.ok(!(query instanceof Promise));
  
    // `.exec()` gives you a fully-fledged promise
    var promise = query.exec();
    assert.ok(promise instanceof Promise);

    promise.then(function (resul) {

        if(resul.estado=='disponible'){
            resul.estado='cerrado'
       }else{
            resul.estado='disponible'
       }
     
       Curso.findOneAndUpdate({id : req.body.idcurso}, {$set: {"estado": resul.estado}}, { runValidators: true, context: 'query' }, (err, resultados) => {
            if (err){
                return console.log(err)
            }
            flagCambioEstadoCurso=true
            res.redirect('listarcursoscoord')
            
        })	
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

//para que un usuario se inscriba en un curso
app.get('/inscribir',isAuthenticated, (req,res)=>{
    
    if (req.session.rol!="Aspirante"){    
        return res.redirect('/');
    }


    var query = Curso.find({estado:'disponible'})
    assert.ok(!(query instanceof Promise));
  
    // `.exec()` gives you a fully-fledged promise
    var promise = query.exec();
    assert.ok(promise instanceof Promise);

    promise.then(function (listaCursos) {

        let flag_cursos=true

        if(listaCursos.length == 0){
            flag_cursos=false
        }

        Usuario.findById(req.session.usuario, (err, usuario) =>{
			if (err){
				return console.log(err)
            }

            res.render ('inscribir',{
                listCursos : listaCursos,
                infoUsuario:[usuario],
                flagEstudianteInscrito:flagEstudianteInscrito,
                flagcurso:flag_cursos
            })


            if(flagEstudianteInscrito==false){
                flagEstudianteInscrito=true
            }
		});

    });


 
})

app.post('/inscribir', isAuthenticated,(req,res)=>{
    console.log("inscribir")
    //la persona selecciona el curso y en el body llega el id correspondiente
    let curso=req.body.curso_id

    var query = Curso.find({id: req.body.curso_id})
    assert.ok(!(query instanceof Promise));
  
    // `.exec()` gives you a fully-fledged promise
    var promise = query.exec();
    assert.ok(promise instanceof Promise);

    promise.then(function (InfoCurso) {
        let estudiantes_id=InfoCurso[0].estudiantes

        flag_est=estudiantes_id.includes(req.session.documento)
        console.log('documento '+req.session.documento)

        if(!flag_est){
            Curso.findOneAndUpdate({ id: req.body.curso_id }, { $push: { "estudiantes": req.session.documento  } },
                function (err, success) {
                    if (err){
                        return console.log(err)
                    }
                    console.log(success)
                    res.render('fininscripcion',{
                        curso : success.nombre
        
                    })
                })

        }else{
            flagEstudianteInscrito=false;
            res.redirect('/inscribir')
        }
      
        
    })

})



// //para ver los estudiantes inscritos en cada curso por parte del coordinador
// //e igualmente se pueden eliminar los estudiantes


app.get('/verinscritos',  isAuthenticated,(req,res)=>{
    
    if (req.session.rol!="Coordinador"){
        return res.redirect('/');
    }

   var query = Usuario.find({rol: "Aspirante"})
   assert.ok(!(query instanceof Promise));
 
   // `.exec()` gives you a fully-fledged promise
   var promise = query.exec();
   assert.ok(promise instanceof Promise);

   promise.then(function (aspirante) {
  
        //let estudiantes_id=InfoCurso[0].estudiantes

        Curso.find({ estado:'disponible'} ,(err,respuesta)=>{
                if (err){
                    return console.log(err)
                }
                //console.log(respuesta)
                let el;
                respuesta.forEach(function(item){
                    //console.log(item.estudiantes)
                    item.estudiantes.forEach(function(es,index){
                        //console.log(es)

                        el=aspirante.find(asp=>asp.documento==es)
                        item.estudiantes[index]=el
                        //console.log(es)
                    })
                })
                 

                res.render('verinscritos',{
                    listCursos:respuesta
                })
            })
  
   })

})

app.post('/verinscritos',isAuthenticated, (req,res)=>{
    
   
    let todelete=req.body.deleteestudiante //desde el formulario retorna idcurso-documentoestudiante
    let array = todelete.split("-");


    Curso.findOneAndUpdate({ id: array[0] }, { $pull: { "estudiantes": array[1]  } },
        function (err, success) {
            if (err){
                return console.log(err)
            }
            console.log(success)
            res.redirect('/verinscritos')
        })

  
 
})

//envio de correos por parte del coordinador

app.get('/enviocorreo',isAuthenticated, (req,res)=>{
    
    if (req.session.rol!="Coordinador"){    
        return res.redirect('/');
    }

    Curso.find({estado:'disponible'}, (err, listaCursos) =>{
        if (err){
            return console.log(err)
        }

        let mensaje
        
        //bandera para detectar si hay cursos con estado disponible
        let flag_cursos=true
        
        if(listaCursos.length == 0){
            flag_cursos=false
            mensaje="En este momento no se puede enviar correos, ya que no hay cursos con estado disponible"
        }else{
             //Verificar sólo para cuales cursos hay estudiantes inscritos            
            listaCursos=listaCursos.filter(asp=>asp.estudiantes.length!=0)
            
            if(!Array.isArray(listaCursos)){ //si solo retorna un elemento, lo retorna como objeto y no como array
                listaCursos=[listaCursos]
            }

           
            if(listaCursos.length === 0){
                flag_cursos=false
                mensaje="En este momento no se puede enviar correos, ya que no hay estudiantes inscritos en ningún curso"
                console.log("ok")
            }

        }

        res.render ('enviocorreoscoord',{
            listCursos : listaCursos,
            flagcurso:flag_cursos,
            mensaje:mensaje,
            //flagEstudianteInscrito:flagEstudianteInscrito,
            flagcurso:flag_cursos
        })

        if(flag_cursos==false){
            flag_cursos=true
        }
    });
})

app.post('/enviocorreo',isAuthenticated, (req,res)=>{
    
   let correos=[]
   var query = Usuario.find({rol: "Aspirante"})
   assert.ok(!(query instanceof Promise));
 
   // `.exec()` gives you a fully-fledged promise
   var promise = query.exec();
   assert.ok(promise instanceof Promise);

   promise.then(function (aspirante) {

        Curso.find({ id:req.body.curso_id} ,(err,respuesta)=>{
                if (err){
                    return console.log(err)
                }
                let el;
                
                respuesta.forEach(function(item){
                    //accedo a la prop estudiantes, que tiene un array con el id de los estudiantes matriculados
                    item.estudiantes.forEach(function(es,index){
                        el=aspirante.find(asp=>asp.documento==es)
                        correos.push(el.correo)
                    })
                })
                 

               //Enviar correo
                if (correos){
                    for (let x in correos){
                        const msg={
                            to:correos[x], 
                            from:'aleja830@gmail.com',
                            subject:req.body.asunto,
                            text:req.body.Texto}
                        console.log(msg)
                        sgMail.send(msg)    
                    } 

                    flag_cursos=false
                    mensaje="Correo enviado a: "+correos.join()
                    res.render ('enviocorreoscoord',{
                        //listCursos : listaCursos,
                        flagcurso:flag_cursos,
                        mensaje:mensaje
                    })
                      
                    if(flag_cursos==false){
                        flag_cursos=true
                    }

                }
                
               
            })
  
   })
 
})

//actualización del perfil por parte del usuario

app.get('/perfil',isAuthenticated, (req,res)=>{
    

    Usuario.findById(req.session.usuario, (err, usuario) =>{
        if (err){
            return console.log(err)
        }
        foto_perfil=''
        extension=''
        let fotoperfil64
        if(usuario.fotoperfil){
            foto_perfil=usuario.fotoperfil
            fotoperfil64=foto_perfil.toString('base64')
            extension=usuario.extensionfoto
        }
        
        res.render ('perfil',{
            infoUsuario:[usuario],
            foto_perfil:fotoperfil64,
            flagperfil:flagperfil
        })

        if(flagperfil==true){
            flagperfil=false
        }

    });
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

var upload = multer({ })

app.post('/perfil',upload.single('archivo'),(req,res)=>{

    if(req.file){
        extension = path.extname(req.file.originalname);
        extension=extension.replace(".", "");
        foto_perfil=req.file.buffer
    }
   
    Usuario.findOneAndUpdate({documento : req.session.documento}, {$set: {"correo":req.body.correo,"telefono":req.body.telefono,"fotoperfil": foto_perfil,"extensionfoto":extension}}, { runValidators: true, context: 'query' },
     (err, resultados) => {
        if (err){
            return console.log(err)
        }
        flagperfil=true
        res.redirect('/perfil')
        
    })	

})

//para que el aspirante pueda ver los cursos en los que está inscrito
app.get('/miscursos',  isAuthenticated,(req,res)=>{
    
    if (req.session.rol!="Aspirante"){
        return res.redirect('/');
    }
    let cursosEstudiante=[]

     Curso.find({ estado:'disponible'} ,(err,respuesta)=>{
        if (err){
            return console.log(err)
        }

        let el;
        //console.log(respuesta)
        respuesta.forEach(function(item){
            //accedo a la prop estudiantes, que tiene un array con el id de los estudiantes matriculados
            item.estudiantes.forEach(function(es,index){
                if(es.includes(req.session.documento)){
                    cursosEstudiante.push(item)
                }
               
            })
                
           
        })
            
        console.log(cursosEstudiante)
        res.render('miscursos',{
            listCursos:cursosEstudiante
        })
    })
  


})




const { Usuarios } = require('../chat/usuarios');
// const {server} = require('../app')
// const io = require('socket.io').listen(server);




module.exports = app