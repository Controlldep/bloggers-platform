import {Router} from "express";
import {authRefreshMiddleware} from "../middleware/authRefreshMiddleware";
import {SecurityDevicesController} from "../controllers/securityDevicesController";
import {container} from "../../compositionRoot/compositionRoot";
import {JwtService} from "../../authorization/service/jwtService";

const jwtService = container.get(JwtService);
const securityDevicesController = container.get(SecurityDevicesController)


export const sessionRouter:Router = Router();

sessionRouter
    .get('/security/devices' , authRefreshMiddleware(jwtService) , securityDevicesController.getAllSessions.bind(securityDevicesController))
    .delete('/security/devices' ,authRefreshMiddleware(jwtService) ,securityDevicesController.deleteAllSession.bind(securityDevicesController))
    .delete('/security/devices/:id' ,authRefreshMiddleware(jwtService) , securityDevicesController.deleteSessionById.bind(securityDevicesController))