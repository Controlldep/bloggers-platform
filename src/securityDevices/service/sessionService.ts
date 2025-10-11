import {sessionRepositories} from "../repositories/sessionRepositories";
import {sessionModel} from "../models/sessionModel";
import {sessionMapper} from "../models/sessionViewModel";

const { v4: uuidv4 } = require("uuid");



export const sessionService = {
    async createDeviceID() {
        return await uuidv4();
    },

    async saveSession(sessionData: sessionModel) {
        const session:sessionModel = {
            userId: sessionData.userId,
            deviceId: sessionData.deviceId,
            ip: sessionData.ip,
            deviceTitle: sessionData.deviceTitle,
            lastActiveDate: sessionData.lastActiveDate,
            expirationDate: sessionData.expirationDate,
        }
        const saveSession = await sessionRepositories.createSession(session);
        return true
    },

    async findSessionByDeviceId(deviceId: string) {
        const findSessionById = await sessionRepositories.findSessionByDeviceId(deviceId)

        return findSessionById
    },

    async getAllDevices(userId: string) {
        const getDevices = await sessionRepositories.getAllSessionsByUser(userId);

        return getDevices.map(sessionMapper)
    },

    async deleteDeviceById(userId: string, deviceId: string) {
        const deleteDevice = await sessionRepositories.deleteSessionByDevice(userId , deviceId);

        return deleteDevice
    },

    async deleteAllDevicesExceptCurrent(userId: string, currentDeviceId: string) {
        const deleted = await sessionRepositories.deleteAllSessionsByUserExceptCurrent(userId, currentDeviceId);
        return deleted;
    },

    async updateLastActiveDate(userId: string, deviceId: string, exp: number) {
        const updateActive = await sessionRepositories.updateLastActiveDate(userId , deviceId , exp)

        return updateActive;
    }
}