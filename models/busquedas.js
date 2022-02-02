const fs = require('fs');

const axios = require('axios');

class Busquedas{
    historial = [];
    dbPath = './db/database.json';

    constructor(){
        //Leer DB si existe
        this.leerDB();
    }

    get paramsMapbox(){
        return {
            'access_token' : process.env.MAPBOX_KEY,
            'limit' : 5,
            'language' :  'es'
        }
    }


    async ciudad(lugar = ""){
        
        try {
            //Peticion http
            const intance = axios.create ({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            throw error;
         }

    }

    get paramsOpenW (){
        return {
            'lang': 'es',
            'units': 'metric',
            'appid': process.env.OPENWEATHER_KEY,
        }
    }

    async climaLugar(lat, lon){
        
        try {
            //intance axios.create()
            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenW, lat, lon}

            }); 
            //resp.data
            const resp = await intance.get();
            const {weather, main} = resp.data;   
            
            return {
                desc: weather[0].description,
                min: main.temp_min, 
                max: main.temp_max,
                actual: main.temp
            }
            
        } catch (error) {
            console.log(error);
        }


    }

    agregarHistorial(lugar = ''){
        //Prevenir duplicado
        if (this.historial.includes(lugar.toLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0,4);
        this.historial.unshift(lugar);
        //Grabar en DB
        this.guardarDB();

    }

    guardarDB(){
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){

        if(!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, {encoding:"utf-8"});
        const data = JSON.parse(info);
        this.historial = data.historial;

    }


}


module.exports = Busquedas;