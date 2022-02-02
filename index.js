require('dotenv').config()

const { pausa } = require("../04-Tareas/helpers/inquirer");
const {leerInput, inquirerMenu, listarLugares} = require("./helpers/inquirer"); 
const Busquedas = require("./models/busquedas");


//console.log(process.env);

const main = async() => {
    
    const busquedas = new Busquedas();
    let opt;

    //Do while para el menu
    do{
        
        //Impresion del menu en consola
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput("Ciudad:");

                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;
                const lugarSel = lugares.find(l => l.id === id);

                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                //Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                //Mostrar resultados
                console.log("\nInformacion de la ciudad\n".green);
                console.log("Ciudad:", lugarSel.nombre.green);
                console.log("Lat:", lugarSel.lat);
                console.log("Lng:", lugarSel.lng);
                console.log("Temperatura", clima.actual);
                console.log("Minima", clima.min);
                console.log("Maxima", clima.max);
                console.log("Como esta el clima: ", clima.desc.green);
                break;
            
            case 2:
                busquedas.historial.forEach((lugar, i) =>{
                    const indice = `${i + 1}.`.green;
                    console.log(`${indice} ${lugar}`);

                })
            
                break;
        
        }

 
        if(opt !== 0) await pausa();


    }while(opt !== 0)

}


main();