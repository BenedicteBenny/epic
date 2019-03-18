import express from 'express';
import allRoutes from './routes';
import bodyParser from 'body-parser';


if(process.env.NODE_ENV !== "development") {
    require("dotenv").config();
}


// import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from './swagger.json';

// const swaggerRouter = Router();
// swaggerRouter.use('/swagger', swaggerUi.serve);
// swaggerRouter.get('/swagger', swaggerUi.setup(swaggerDocument));

if (!process.env.JWTPRIVATEKEY){
    console.error('FATAL ERROR: jwt is not defined');
    process.exit(1);
}

const app=express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//app.use(express.json())

app.use('/api/v1/', allRoutes);

const port=process.env.PORT||3000;
const server=app.listen(port, ()=>console.log(`The server is listening on port ${port}`));

module.exports = server
