
const fs=require('fs');
let {cursos}= require('./datos');

 let curso,texto;
 let counter=2000;

 //función para imprimir cursos

 let printCourses=(curso,counter,callback)=>{
    setTimeout(()=>{
        let result="El curso se llama "+curso.nombre+ " tiene una duración de "+curso.duracion+ " y un valor de "+curso.valor+" pesos";
        callback(result);
    }, counter);
 }
 
//opciones para ingreso de info por parte del usuario
const opciones={

    id:{
        demand:true,
        alias:'i'
    },
    nombre:{
        demand:true,
        alias:'n'
    },

    cedula:{
        demand:true,
        alias:'x'
    },

}

const argv=require('yargs')
            .command('inscribir','Inscribir al usuario',opciones)
            .argv


//funcion para creación de archivo de prematricula
let crearArchivo=()=>{

    texto="El estudiante "+argv.n+"\n"+
           "con cedula "+argv.x+"\n"+
           "se ha matriculado en el curso llamado "+curso.nombre+"\n"+" . Tiene una duración de "+curso.duracion+
           " horas y un valor de $"+curso.valor+"\n";

    // fs.writeFile("matricula.txt",texto,(err)=>{
    //     if (err) throw (err);
    //     console.log('Se ha creado el archivo');
    // }
   // )       
}


//buscar curso
if(argv.i){
    curso = cursos.find( c => c.id == argv.i);
    if(curso){
        crearArchivo();
    }else{
        console.log('Se ha ingresado un ID que no corresponde a ningun curso');
        require('./principal')
    }
}else{
        //Recorrer lista de cursos e imprimirlos, usando también setTimeOut
    for (i in cursos){
        curso=cursos[i];
        printCourses(curso,counter,function(result){
            console.log(result);
        });
        
        counter+=2000;
    }
}


module.exports={
    texto
}