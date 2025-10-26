import {sessionCollection} from "../../db/mongoDb";
import {sessionModel} from "../models/sessionModel";
import {WithId} from "mongodb";


export const sessionRepositories = {
    async createSession(data: sessionModel):Promise<boolean> {
        await sessionCollection.insertOne(data);
        return true;
    },

    async findSessionByDeviceId(deviceId: string):Promise<WithId<sessionModel> | null> {
        return await sessionCollection.findOne({ deviceId });
    },

    async updateLastActiveDate(userId: string, deviceId: string, exp: number):Promise<boolean> {
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
        const findSessions:WithId<sessionModel>[] = await sessionCollection.find({userId: userId}).toArray()

        return findSessions
    },

    async deleteAllSessionsByUserExceptCurrent(userId: string, currentDeviceId: string):Promise<boolean> {
        const result = await sessionCollection.deleteMany({
            userId,
            deviceId: { $ne: currentDeviceId }
        });
        return result.deletedCount > 0;
    },

    async deleteSessionByDevice(userId: string , deviceId: string):Promise<boolean> {
        const deleteSession = await sessionCollection.deleteOne({userId: userId , deviceId: deviceId})

        return deleteSession.deletedCount > 0;
    }
}
