import {refreshTokensCollection} from "../../db/mongoDb";
import {refreshModel} from "../differenModels/refreshModel";

export const  refreshTokenRepositories = {
    async saveRefreshToken(data: refreshModel) {
        const saveSession = await refreshTokensCollection.insertOne(data);
        return true
    },

    async findTokenByDevice(userId: string, deviceId: string) {
        return await refreshTokensCollection.findOne({ userId, deviceId });
    },

    async deleteSessionByDevice(userId: string, deviceId: string) {
        const result = await refreshTokensCollection.deleteOne({ userId, deviceId });
        return result.deletedCount === 1;
    },

    async updateRefreshToken(userId: string, deviceId: string, hashJti: string, exp: number) {
        const result = await refreshTokensCollection.updateOne(
            { userId, deviceId },
            { $set: { jtiHash: hashJti, expiresAt: new Date(exp * 1000) } },
            { upsert: false }
        );
        return result.matchedCount === 1;
    },

    async deleteAllTokensExceptCurrent(userId: string, currentDeviceId: string) {
        const result = await refreshTokensCollection.deleteMany({
            userId,
            deviceId: { $ne: currentDeviceId },
        });
        return result.deletedCount;
    },
}