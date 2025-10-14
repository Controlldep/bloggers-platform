import {refreshTokensCollection} from "../../db/mongoDb";
import {refreshModel} from "../differenModels/refreshModel";
import {DeleteResult, UpdateResult} from "mongodb";

export const  refreshTokenRepositories = {
    async saveRefreshToken(data: refreshModel):Promise<boolean> {
        await refreshTokensCollection.insertOne(data);
        return true
    },

    async findTokenByDevice(userId: string, deviceId: string):Promise<refreshModel | null> {
        return await refreshTokensCollection.findOne({ userId, deviceId });
    },

    async deleteSessionByDevice(userId: string, deviceId: string):Promise<boolean> {
        const result:DeleteResult = await refreshTokensCollection.deleteOne({ userId, deviceId });
        return result.deletedCount === 1;
    },

    async updateRefreshToken(userId: string, deviceId: string, hashJti: string, exp: number):Promise<boolean>  {
        const result:UpdateResult<refreshModel> = await refreshTokensCollection.updateOne(
            { userId, deviceId },
            { $set: { jtiHash: hashJti, expiresAt: new Date(exp * 1000) } },
            { upsert: false }
        );
        return result.matchedCount === 1;
    },

    async deleteAllTokensExceptCurrent(userId: string, currentDeviceId: string):Promise<number>  {
        const result:DeleteResult = await refreshTokensCollection.deleteMany({
            userId,
            deviceId: { $ne: currentDeviceId },
        });
        return result.deletedCount;
    },
}