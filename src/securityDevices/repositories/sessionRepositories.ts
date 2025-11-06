import {SessionCollection} from "../../db/mongoDb";
import {sessionModel} from "../models/sessionModel";
import {WithId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class SessionRepositories {
    async createSession(data: sessionModel):Promise<boolean> {
        await SessionCollection.create(data);
        return true;
    }

    async findSessionByDeviceId(deviceId: string):Promise<WithId<sessionModel> | null> {
        return await SessionCollection.findOne({ deviceId });
    }

    async updateLastActiveDate(userId: string, deviceId: string, exp: number):Promise<boolean> {
        const result = await SessionCollection.updateOne(
            {userId, deviceId},
            {
                $set: {
                    lastActiveDate: new Date().toISOString(),
                    expirationDate: new Date(exp * 1000).toISOString(),
                },
            }
        );
        return result.matchedCount === 1;
    }

    async getAllSessionsByUser(userId: string) {
        const findSessions:WithId<sessionModel>[] = await SessionCollection.find({userId: userId})

        return findSessions
    }

    async deleteAllSessionsByUserExceptCurrent(userId: string, currentDeviceId: string):Promise<boolean> {
        const result = await SessionCollection.deleteMany({
            userId,
            deviceId: { $ne: currentDeviceId }
        });
        return result.deletedCount > 0;
    }

    async deleteSessionByDevice(userId: string , deviceId: string):Promise<boolean> {
        const deleteSession = await SessionCollection.deleteOne({userId: userId , deviceId: deviceId})

        return deleteSession.deletedCount > 0;
    }
}
