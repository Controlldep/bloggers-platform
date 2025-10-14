import {sessionRepositories} from "../repositories/sessionRepositories";
import {sessionModel} from "../models/sessionModel";
import {sessionMapper, sessionViewModel} from "../models/sessionViewModel";
import {WithId} from "mongodb";
const { v4: uuidv4 } = require("uuid");

export const sessionService = {
    async createDeviceID() {
        return await uuidv4();
    },

    async saveSession(sessionData: sessionModel):Promise<boolean> {
        const session:sessionModel = {
            userId: sessionData.userId,
            deviceId: sessionData.deviceId,
            ip: sessionData.ip,
            deviceTitle: sessionData.deviceTitle,
            lastActiveDate: sessionData.lastActiveDate,
            expirationDate: sessionData.expirationDate,
        }
        await sessionRepositories.createSession(session);
        return true
    },

    async findSessionByDeviceId(deviceId: string):Promise<WithId<sessionModel> | null> {
        const findSessionById:WithId<sessionModel> | null = await sessionRepositories.findSessionByDeviceId(deviceId)

        return findSessionById
    },

    async getAllDevices(userId: string):Promise<sessionViewModel[]> {
        const getDevices:WithId<sessionModel>[] = await sessionRepositories.getAllSessionsByUser(userId);

        return getDevices.map(sessionMapper)
    },

    async deleteDeviceById(userId: string, deviceId: string):Promise<boolean> {
        const deleteDevice:boolean = await sessionRepositories.deleteSessionByDevice(userId , deviceId);

        return deleteDevice
    },

    async deleteAllDevicesExceptCurrent(userId: string, currentDeviceId: string):Promise<boolean> {
        const deleted:boolean = await sessionRepositories.deleteAllSessionsByUserExceptCurrent(userId, currentDeviceId);
        return deleted;
    },

    async updateLastActiveDate(userId: string, deviceId: string, exp: number):Promise<boolean> {
        const updateActive:boolean = await sessionRepositories.updateLastActiveDate(userId , deviceId , exp)

        return updateActive;
    }
}