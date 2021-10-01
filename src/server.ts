// In this file the app is launched
import mongoose from 'mongoose';
import dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/../config/${process.env.APP_ENV}.env`})
import MainApp from './app'
import { MONGODB_URL } from './config';

/**
 * Initilize the MainApp
 */
const mainApp:MainApp = new MainApp();
mainApp.configureConteiner();
mainApp.printProjectConfiguration();
mainApp.loadAPIport();
mainApp.setMiddlewares();
mainApp.setRouter();

/**
 * Configure and connect the mongoose with the mongodb service
 */
mongoose.connect(MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(db=>{
    console.log(`Mongo DB (${db.connection.name}) is connected`);
    //Start the express App
    mainApp.app.listen(mainApp.app.get('port'), ()=>{
        console.log(`App is running on port: ${mainApp.app.get('port')}`);
    })
});

