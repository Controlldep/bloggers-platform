import {Router} from "express";
import {userValidation} from "../validation/validation";
import {baseAuthorization} from "../../authorization/baseAuthorization";
import {UsersController} from "../handlers/usersController";
import {container} from "../../compositionRoot/compositionRoot";

const usersController = container.get(UsersController)

export const usersRouter = Router();

usersRouter
    .get('/users' , baseAuthorization, usersController.getUsersHandler.bind(usersController))
    .post('/users' , baseAuthorization, userValidation, usersController.createUserHandler.bind(usersController))
    .delete('/users/:id' ,baseAuthorization, usersController.deleteUserHandler.bind(usersController))