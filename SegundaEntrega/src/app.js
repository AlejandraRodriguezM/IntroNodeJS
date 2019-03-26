const express=require('express');
const app=express();
const path=require('path');
const hbs=require('hbs');
const bodyParser=require('body-parser')
const funciones=require('./funciones')

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
    res.render('crearcurso')
})

app.post('/crearcurso', (req,res)=>{
   
    let mod;
    if(req.body.Modalidad===undefined){
        mod='-'
    }else{
        mod=req.body.Modalidad
    }

    let curso={
        id:req.body.Idcurso,
        nombre:req.body.Nombrecurso,
        modalidad:mod,
        valor:req.body.Valor,
        descripcion:req.body.Descripcion,
        intensidad:req.body.Intensidad,
        estado:'disponible'
    }
    let flag=funciones.crearCurso(curso)
    if (!flag){
        res.redirect('/listado_pedidos');
    }else{
        //res.redirect('/listado_pedidos');
        res.send('registrado')
    }
    
    console.log(curso)
})

app.listen(3000,()=>{
    console.log('Escuchando en el puerto 3000')
})

