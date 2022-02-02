const inquirer = require("inquirer");
require("colors");

//Creacion de la lista de opciones del menu
const preguntas = [{
    type: "list",
    name: "opcion",
    message: "¿Qué desea hacer?",
    choices: [
        {
            value: 1,
            name: `${"1.".green} Buscar ciudad`
        },
        {
            value: 2,
            name: `${"2.".green} Historial`
        },
        {
            value: 0,
            name: `${"0.".green} Salir`
        }
    ]

}];

//Creacion del menu
const inquirerMenu = async () =>{
    console.clear();
    console.log("============================".green);
    console.log("   Seleccione una opción".white);
    console.log("============================".green);

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;
}

//Pausa y confirmacion con la tecla ENTER
const pausa = async () =>{
    const question = [
        {
            type: "input",
            name: "enter",
            message: `Presione ${"enter".green} para continuar`
        }
    ];
    console.log("\n");
    await inquirer.prompt(question);
}

//Lectura de los datos que el usuario ingrese a traves de la consola
const leerInput = async(message) => {
    const question = [
        {
            type: "input",
            name: "desc",
            message,
            validate(value){
                if(value.length === 0){
                    return "Por favor ingrese un valor";
                }
                return true;
            }
        }
    ];
    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async (lugares = []) => {

    const choices = lugares.map((lugar,i) =>{
        const indice = `${i + 1}.`.green;

        return {
            value: lugar.id,
            name: `${indice} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: "0",
        name: "0.".green + " Cancelar"
    });

    const preguntas = [
        {
            type: "list",
            name: "id",
            message: "Seleccione lugar: ",
            choices
        }
    ]
    const { id } = await inquirer.prompt(preguntas);
    return id;
}

const confirmar = async (message) => {
    const question = [
        {
            type: "confirm",
            name: "ok",
            message
        }
    ];
    const {ok} = await inquirer.prompt(question);
    return ok; 
}

const mostrarListadoCheckList = async (tareas = []) => {

    const choices = tareas.map((tarea,i) =>{
        const indice = `${i + 1}.`.green;

        return {
            value: tarea.id,
            name: `${indice} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        }
    });

    const pregunta = [
        {
            type: "checkbox",
            name: "ids",
            message: "Selecciones",
            choices
        }
    ]
    const { ids } = await inquirer.prompt(pregunta);
    return ids;
}


//Exportacion de los modulos
module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList 
}