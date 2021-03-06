const express=require('express');
const app=express();
const path=require('path');
const hbs=require('hbs');
const bodyParser=require('body-parser')
const mongoose = require('mongoose');
const session = require('express-session')
var MemoryStore = require('memorystore')(session)



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

//### Para usar las variables de sesión
app.use(session({
	cookie: { maxAge: 86400000 },
 	store: new MemoryStore({
      	checkPeriod: 86400000 // prune expired entries every 24h
    	}),
  	secret: 'keyboard cat',
  	resave: true,
  	saveUninitialized: true
}))


app.use((req, res, next) =>{

	// res.locals.sesion = true
	// 	res.locals.nombre = "aleja"
	// 	res.locals.rol = "Aspirante"
	
	if(req.session.usuario){		
		res.locals.sesion = true
		res.locals.nombre_usuario = req.session.nombre
		res.locals.rol = req.session.rol
	}
	next()
	
})

//Routes
app.use(require('./routes/index'));



// Connection URL

process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB =  'mongodb://localhost:27017/myproject';
}
else {
	urlDB = 'mongodb+srv://alejandra:bdalejandracurso@nodejscursointronode-gjo5f.mongodb.net/myproject?retryWrites=true'
}

process.env.URLDB = urlDB

mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, resultado) => {
	if (err){
		return console.log(error)
	}
	console.log("conectado")
});



app.listen(process.env.PORT, () => {
	console.log ('servidor en el puerto ' + process.env.PORT)
});