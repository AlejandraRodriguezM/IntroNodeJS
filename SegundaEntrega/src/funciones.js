const fs=require('fs');
listaCursos=[]


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
    console.log(cursosDisponibles)
    if(!cursosDisponibles){
        console.log('No hay cursos disponibles')
    }
    
    return cursosDisponibles
}

module.exports={
    listarCursos,
    crearCurso,
    guardarCurso,
    listaCursos,
    listarCursosDisponibles
}