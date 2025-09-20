import {Router} from "express";
import {getUsersHandler} from "../handlers/getUsersHandler";
import {createUserHandler} from "../handlers/createUserHandler";
import {deleteUserHandler} from "../handlers/deleteUserHandler";
import {userValidation} from "../validation/validation";
import {baseAuthorization} from "../../authorization/baseAuthorization";


export const usersRouter = Router();

usersRouter
    .get('/users' , baseAuthorization, getUsersHandler)
    .post('/users' , baseAuthorization, userValidation, createUserHandler)
    .delete('/users/:id' ,baseAuthorization, deleteUserHandler)