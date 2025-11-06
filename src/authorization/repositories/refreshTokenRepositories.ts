import {RefreshTokensCollection} from "../../db/mongoDb";
import {refreshModel} from "../differenModels/refreshModel";
import {DeleteResult, UpdateResult} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class RefreshTokenRepositories {
    async saveRefreshToken(data: refreshModel):Promise<boolean> {
        await RefreshTokensCollection.create(data);
        return true
    }

    async findTokenByDevice(userId: string, deviceId: string):Promise<refreshModel | null> {
        return await RefreshTokensCollection.findOne({ userId, deviceId });
    }

    async deleteSessionByDevice(userId: string, deviceId: string):Promise<boolean> {
        const result:DeleteResult = await RefreshTokensCollection.deleteOne({ userId, deviceId });
        return result.deletedCount === 1;
    }

    async updateRefreshToken(userId: string, deviceId: string, hashJti: string, exp: number):Promise<boolean>  {
        const result:UpdateResult<refreshModel> = await RefreshTokensCollection.updateOne(
            { userId, deviceId },
            { $set: { jtiHash: hashJti, expiresAt: new Date(exp * 1000) } },
            { upsert: false }
        );
        return result.matchedCount === 1;
    }

    async deleteAllTokensExceptCurrent(userId: string, currentDeviceId: string):Promise<number>  {
        const result:DeleteResult = await RefreshTokensCollection.deleteMany({
            userId,
            deviceId: { $ne: currentDeviceId },
        });
        return result.deletedCount;
    }
}