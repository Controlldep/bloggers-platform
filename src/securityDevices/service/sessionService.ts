import {SessionRepositories} from "../repositories/sessionRepositories";
import {sessionModel} from "../models/sessionModel";
import {sessionMapper, sessionViewModel} from "../models/sessionViewModel";
import {WithId} from "mongodb";
import {inject, injectable} from "inversify";
const { v4: uuidv4 } = require("uuid");

@injectable()
export class SessionService {

    constructor(@inject(SessionRepositories) protected sessionRepositories: SessionRepositories) {}

    async createDeviceID() {
        return await uuidv4();
    }

     async saveSession(sessionData: sessionModel):Promise<boolean> {
        const session:sessionModel = {
            userId: sessionData.userId,
            deviceId: sessionData.deviceId,
            ip: sessionData.ip,
            deviceTitle: sessionData.deviceTitle,
            lastActiveDate: sessionData.lastActiveDate,
            expirationDate: sessionData.expirationDate,
        }
        await this.sessionRepositories.createSession(session);
        return true
    }

    async findSessionByDeviceId(deviceId: string):Promise<WithId<sessionModel> | null> {
        const findSessionById:WithId<sessionModel> | null = await this.sessionRepositories.findSessionByDeviceId(deviceId)

        return findSessionById
    }

    async getAllDevices(userId: string):Promise<sessionViewModel[]> {
        const getDevices:WithId<sessionModel>[] = await this.sessionRepositories.getAllSessionsByUser(userId);

        return getDevices.map(sessionMapper)
    }

    async deleteDeviceById(userId: string, deviceId: string):Promise<boolean> {
        const deleteDevice:boolean = await this.sessionRepositories.deleteSessionByDevice(userId , deviceId);

        return deleteDevice
    }

    async deleteAllDevicesExceptCurrent(userId: string, currentDeviceId: string):Promise<boolean> {
        const deleted:boolean = await this.sessionRepositories.deleteAllSessionsByUserExceptCurrent(userId, currentDeviceId);
        return deleted;
    }

    async updateLastActiveDate(userId: string, deviceId: string, exp: number):Promise<boolean> {
        const updateActive:boolean = await this.sessionRepositories.updateLastActiveDate(userId , deviceId , exp)

        return updateActive;
    }
}