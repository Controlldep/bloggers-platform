import {Request, Response} from 'express';
import {SessionService} from "../service/sessionService";
import {sessionViewModel} from "../models/sessionViewModel";
import {WithId} from "mongodb";
import {sessionModel} from "../models/sessionModel";
import {RefreshTokenRepositories} from "../../authorization/repositories/refreshTokenRepositories";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityDevicesController {

    constructor(
        @inject(SessionService) protected sessionService: SessionService,
        @inject(RefreshTokenRepositories) protected refreshTokenRepositories: RefreshTokenRepositories
    ) {}

    async getAllSessions(req: Request, res: Response) {
        const getSessions: sessionViewModel[] = await this.sessionService.getAllDevices(req.userId!);

        return res.status(200).send(getSessions)
    }

    async deleteSessionById(req: Request, res: Response) {
        const sessionDevice: WithId<sessionModel> | null = await this.sessionService.findSessionByDeviceId(req.params.id);
        if (!sessionDevice) return res.sendStatus(404);
        //TODO вынести через сервис
        if (sessionDevice.userId !== req.userId) return res.sendStatus(403);
        await this.sessionService.deleteDeviceById(req.userId, req.params.id);
        await this.refreshTokenRepositories.deleteSessionByDevice(req.userId, req.params.id);

        return res.sendStatus(204)
    }

    async deleteAllSession(req: Request, res: Response) {
        await this.sessionService.deleteAllDevicesExceptCurrent(req.userId!, req.deviceId!);
        await this.refreshTokenRepositories.deleteAllTokensExceptCurrent(req.userId!, req.deviceId!)
        return res.sendStatus(204);
    }
}