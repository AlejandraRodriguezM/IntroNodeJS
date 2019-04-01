const fs=require('fs');
listaCursos=[]
listaEstudiantes=[]
var ultimoCursoEstudiante={};


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

//para cambiar el estado de un curso de disponible a cerrado o viceversa
const cambiarEstadoCurso=(idCurso)=>{
    listarCursos()
    let indexCurso=listaCursos.findIndex(c=>c.id==idCurso)

    let estadoActual=listaCursos[indexCurso].estado
    
    if (estadoActual=='disponible'){
        listaCursos[indexCurso].estado='cerrado'
    }else{
        listaCursos[indexCurso].estado='disponible'
    }
    guardarCurso()

}

const crearEstudiante=(estudiante,curso)=>{
    let flagEstudianteInscrito=false;
    
    listarCursos()
    index_curso=listaCursos.findIndex(cur=>cur.nombre==curso)

    if(!listaCursos[index_curso].estudiantes){
        listaCursos[index_curso].estudiantes=[]      
    }
    let duplicado=listaCursos[index_curso].estudiantes.find(est=>est.documento==estudiante.documento)
    if(!duplicado){
        listaCursos[index_curso].estudiantes.push(estudiante)
        guardarCurso()
        flagEstudianteInscrito=true;
        ultimoCursoEstudiante={curso:curso,nombre:estudiante.nombre}
    }
     return flagEstudianteInscrito
}


const getUltimoCursoEstudiante=()=>{
    return ultimoCursoEstudiante
}

const eliminarEstudiante=(idcurso_documento)=>{
    let array = idcurso_documento.split("-");
    let indexCurso=listaCursos.findIndex(c=>c.id==array[0])

    let newEstudiantes=listaCursos[indexCurso].estudiantes.filter(est=>est.documento!=array[1])
    listaCursos[indexCurso].estudiantes=newEstudiantes
    guardarCurso()

}

module.exports={
    listarCursos,
    crearCurso,
    guardarCurso,
    listaCursos,
    listarCursosDisponibles,
    listaEstudiantes,
    crearEstudiante,
    getUltimoCursoEstudiante,
    cambiarEstadoCurso,
    eliminarEstudiante
}