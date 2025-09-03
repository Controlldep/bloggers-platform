import {ValidationError} from "../inputValidationMiddleware";
import {blogsModel} from "../../model/blogsModel";



export const blogsInputValidation =(blog: blogsModel): ValidationError[] => {
    const errors: ValidationError[] = [];
    const pattern: RegExp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

    if (
        !blog.name ||
        typeof blog.name !== 'string' ||
        blog.name.trim().length < 2 ||
        blog.name.trim().length > 15
    ) {
        errors.push({field: 'name', message: 'invalid name'})
    }

    if (
        !blog.description ||
        typeof blog.description !== 'string' ||
        blog.description.trim().length < 2 ||
        blog.description.trim().length > 500
    ) {
        errors.push({field: 'description', message: 'invalid description'})
    }

    if (
        !blog.websiteUrl ||
        typeof blog.websiteUrl !== 'string' ||
        blog.websiteUrl.trim().length > 100 ||
        !pattern.test(blog.websiteUrl)

    ) {
        errors.push({field: 'websiteUrl', message: 'invalid websiteUrl'})
    }

    return errors

}