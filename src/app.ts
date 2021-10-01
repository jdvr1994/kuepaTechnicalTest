// In this file the app behaviour is defined
import express = require('express');
import cors from 'cors'
import MainRouter from './routes';
import { API_URL, APP_FOO, MONGODB_URL, SERVER_PORT } from './config';
import { jsonFormatMiddleware } from './middlewares/jsonFormat.middleware';
import {setConteiner} from './container'
import { BLUE_COLOR, GRAY_COLOR, RESET_COLOR, YELLOW_COLOR } from './utils/styles/colors';

class MainApp{
    
    public app:express.Application = express();

    /**
     * it is a symple constructor
     */
    constructor(){
        // Set the main env variables in order to load the joined configuration later
        console.log(`Working with ${process.env.APP_ENV} instance`)
        process.env.NODE_ENV = process.env.NODE_ENV || 'development';
        process.env.APP_ENV = process.env.APP_ENV || 'development';
    }

    /**
     * Set Conteiner (it has to done before the routes configuration)
     */
    configureConteiner():void{
        setConteiner();
    }
    
    /**
     * Print the project configuration based on configuration files (development.env, staging.env, production.env)
     */
    printProjectConfiguration():void{
        console.log(`Configuration loaded as ${BLUE_COLOR}${APP_FOO}${RESET_COLOR} instance from ${YELLOW_COLOR}${`${__dirname}/../config/${process.env.APP_ENV}.env`}${RESET_COLOR}`);
        console.log(`${GRAY_COLOR}SERVER_PORT: ${BLUE_COLOR}${SERVER_PORT}${RESET_COLOR}`);
        console.log(`${GRAY_COLOR}MONGODB_URL: ${BLUE_COLOR}${MONGODB_URL}${RESET_COLOR}`);
        console.log(`${GRAY_COLOR}API_URL: ${BLUE_COLOR}${API_URL}${RESET_COLOR}`);
        
    }

    loadAPIport():void{
        const port = process.env.port? process.env.port : SERVER_PORT;
        this.app.set('port',port);
    }

    /**
     * Set the router for express API
     */
    setRouter():void{
        const instanceRouter:MainRouter = new MainRouter();
        instanceRouter.setRouters()
        this.app.use(API_URL,instanceRouter.routes);
        
        this.app.get('/',(req:express.Request, res: express.Response)=>{
            return res.status(200).send(`Server working with ${process.env.APP_ENV} instance`);
        });
    }

    /**
     * Set middlewares for express API
     */
    setMiddlewares():void{
        this.app.use(express.urlencoded({ extended: false })); // Allow to receive messages with form format
        this.app.use(express.json()); // Allow to receive messages with json format
        this.app.use(jsonFormatMiddleware); // Capture the malformed json messages
        this.app.use(cors()); // Allow to send messages to another server
    }
}

export default MainApp;