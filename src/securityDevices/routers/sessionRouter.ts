import {Router} from "express";
import {authRefreshMiddleware} from "../middleware/authRefreshMiddleware";
import {getAllSessions} from "../handlers/getAllSessions";
import {deleteSessionById} from "../handlers/deleteSessionById";
import {deleteAllSession} from "../handlers/deleteAllSessions";


export const sessionRouter = Router();

sessionRouter
    .get('/security/devices' , authRefreshMiddleware , getAllSessions)
    .delete('/security/devices' ,authRefreshMiddleware ,deleteAllSession)
    .delete('/security/devices/:id' ,authRefreshMiddleware , deleteSessionById)