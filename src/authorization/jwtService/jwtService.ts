import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";
import {settings} from "../../settings";



export const jwtService = {
    async createJWT(userId: string) {
        const token = jwt.sign({userId} , settings.JWT_SECRET , {expiresIn: '10m'});
        return {
            accessToken: token
        }
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token , settings.JWT_SECRET)
            return result.userId
        }catch (error) {
            return null
        }
    }
}