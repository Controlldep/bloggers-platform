
import {ValidationError} from "../inputValidationMiddleware";
import {postModel} from "../../model/postModel";


export const postInputValidation =(post: postModel): ValidationError[] => {
    const errors: ValidationError[] = [];

    if(
        !post.title ||
        typeof post.title !== 'string' ||
        post.title.trim().length < 2 ||
        post.title.trim().length > 30
    ) {
        errors.push({field: 'title' , message: 'invalid title'})
    }

    if(
        !post.shortDescription ||
        typeof post.shortDescription !== 'string' ||
        post.shortDescription.trim().length < 2 ||
        post.shortDescription.trim().length > 100
    ) {
        errors.push({field: 'shortDescription' , message: 'invalid shortDescription'})
    }

    if(
        !post.content ||
        typeof post.content !== 'string' ||
        post.content.trim().length < 2 ||
        post.content.trim().length > 1000
    ) {
        errors.push({field: 'content' , message: 'content'})
    }

    return errors
}