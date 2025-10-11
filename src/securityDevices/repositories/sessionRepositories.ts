import {sessionCollection} from "../../db/mongoDb";
import {sessionModel} from "../models/sessionModel";


export const sessionRepositories = {
    async createSession(data: sessionModel) {
        const saveSession = await sessionCollection.insertOne(data);
        return true;
    },

    async findSessionByDeviceId(deviceId: string) {
        return await sessionCollection.findOne({ deviceId });
    },

    async updateLastActiveDate(userId: string, deviceId: string, exp: number) {
        const result = await sessionCollection.updateOne(
            {userId, deviceId},
            {
                $set: {
                    lastActiveDate: new Date().toISOString(),
                    expirationDate: new Date(exp * 1000).toISOString(),
                },
            }
        );
        return result.matchedCount === 1;
    },

    async getAllSessionsByUser(userId: string) {
        const findSessions = await sessionCollection.find({userId: userId}).toArray()

        return findSessions
    },

    async deleteAllSessionsByUserExceptCurrent(userId: string, currentDeviceId: string) {
        const result = await sessionCollection.deleteMany({
            userId,
            deviceId: { $ne: currentDeviceId }
        });
        return result.deletedCount > 0;
    },

    async deleteSessionByDevice(userId: string , deviceId: string) {
        const deleteSession = await sessionCollection.deleteOne({userId: userId , deviceId: deviceId})

        return deleteSession.deletedCount > 0;
    }
}
