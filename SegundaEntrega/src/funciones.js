const fs=require('fs');
listaCursos=[]



const listarCursos=()=>{
    try{
        listaCursos=require('./listadoCursos.json')
    }catch(error){
        listaCursos=[]
    }
   
}

const crearCurso=(curso)=>{
    let flagCursoCreated;
    listarCursos();
    let cursoDuplicado=listaCursos.find(cur=>cur.id==curso.id)
    if(!cursoDuplicado){
        listaCursos.push(curso);
        guardarCurso();
    }else{
        flagCursoCreated=false;
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

module.exports={
    listarCursos,
    crearCurso,
    guardarCurso,
    flagCursoCreated
}