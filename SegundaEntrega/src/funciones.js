const fs=require('fs');
listaCursos=[]
listaEstudiantes=[]


const listarCursos=()=>{
    try{
        listaCursos=require('../listadoCursos.json')
    }catch(error){
        listaCursos=[]
    }
   
}

const crearCurso=(curso)=>{
    let flagCursoCreated=false;
    listarCursos();
    
    let cursoDuplicado=listaCursos.find(cur=>cur.id==curso.id)
  
    if(!cursoDuplicado){
        listaCursos.push(curso);
        guardarCurso();
        flagCursoCreated=true;
        
    }

    return flagCursoCreated
}

const guardarCurso=()=>{
    let datosCursos=JSON.stringify(listaCursos);
    fs.writeFile('listadoCursos.json',datosCursos,(err)=>{
        if(err) throw (err);
        console.log('Archivo creado con éxito')
    })
}

//para listar cursos solo con estado=disponible para los interesados
const listarCursosDisponibles=()=>{
    listarCursos()
    let cursosDisponibles=listaCursos.filter(cur=>cur.estado=='disponible');
    
    if(!cursosDisponibles){
        console.log('No hay cursos disponibles')   //OJOOOOOO AJUSTAR!!!!
    }
    
    return cursosDisponibles
}

const listarEstudiantes=()=>{
    try{
        listaEstudiantes=require('../InscripcionEstudiantes.json')
    }catch(error){
        listaEstudiantes=[]
    }
}

const crearEstudiante=(estudiante)=>{
    let flagEstudianteInscrito=false;
    
    listarEstudiantes()
    
    let duplicado=listaEstudiantes.find(est=>est.documento==estudiante.documento && est.curso==estudiante.curso)
    if(!duplicado){
        listaEstudiantes.push(estudiante)
        guardarEstudiante()
        flagEstudianteInscrito=true;
    }
    return flagEstudianteInscrito
}

const guardarEstudiante=()=>{
    let datosEstudiante=JSON.stringify(listaEstudiantes);
    fs.writeFile('InscripcionEstudiantes.json',datosEstudiante,(err)=>{
        if(err) throw (err);
        console.log('Archivo creado con éxito')
    })
}

module.exports={
    listarCursos,
    crearCurso,
    guardarCurso,
    listaCursos,
    listarCursosDisponibles,
    listarEstudiantes,
    crearEstudiante,
    guardarEstudiante
}