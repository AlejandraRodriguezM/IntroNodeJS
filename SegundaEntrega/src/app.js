const express=require('express');
const app=express();
const path=require('path');
const hbs=require('hbs');
const bodyParser=require('body-parser')
const funciones=require('./funciones')

let flag=true;

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

app.get('/', (req,res)=>{
    //res.render('index')

})

app.get('/crearcurso', (req,res)=>{
    res.render('crearcurso',{
        flag_crearcurso:flag
    })
})

app.post('/crearcurso', (req,res)=>{
   
    // let mod;
    // if(req.body.Modalidad===undefined){
    //     mod='-'
    // }else{
    //     mod=req.body.Modalidad
    // }

    let curso={
        id:req.body.Idcurso,
        nombre:req.body.Nombrecurso,
        modalidad:req.body.Modalidad,
        valor:req.body.Valor,
        descripcion:req.body.Descripcion,
        intensidad:req.body.Intensidad,
        estado:'disponible'
    }
    flag=funciones.crearCurso(curso)
    
    if(flag){
         res.redirect('/listarcursoscoord')
    }else{
         res.redirect('/crearcurso');
    }

})

//para listar cursos por parte del coordinador
app.get('/listarcursoscoord', (req,res)=>{
    cursosDisponibles=funciones.listarCursosDisponibles()
    
    res.render('listarcursoscoord',{
        listCursos:listaCursos
    })
})


app.listen(3000,()=>{
    console.log('Escuchando en el puerto 3000')
})

