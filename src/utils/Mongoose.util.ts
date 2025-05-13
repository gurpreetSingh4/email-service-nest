import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { USER_REG_EMAIL_DATA_MODEL, UserRegisteredEmailsDataModel } from "src/schemas/UserRegisteredEmailsData.schema";

@Injectable()
export class MongooseUtilfn {
    private readonly logger = new Logger(MongooseUtilfn.name);
    constructor(
        private readonly configService: ConfigService,
        @InjectModel(USER_REG_EMAIL_DATA_MODEL) private readonly userRegEmailsModel: Model<UserRegisteredEmailsDataModel>
        
    ) {}

    async findRegisteredEmailData(userId: string, regEmail: string) {
    const data = await this.userRegEmailsModel.findOne({
      user: new Types.ObjectId(userId),
      registeredEmailsData: {
        $elemMatch: { regEmail: regEmail }
      }
    }, {
      'registeredEmailsData.$': 1 // Only project the matching element
    });

    return data?.registeredEmailsData?.[0] || null;
  }

async upsertRegisteredEmailData(
  userId: string,
  newEntry: {
    regEmail: string;
    regEmailName?: string;
    regEmailRefreshToken?: string;
    regEmailPicture?: string;
  }
) {
  const userObjectId = new Types.ObjectId(userId);

  // First, check if the user document exists at all
  const existingUserDoc = await this.userRegEmailsModel.findOne({ user: userObjectId });

  if (!existingUserDoc) {
    // Create new document for the user
    const created = await this.userRegEmailsModel.create({
      user: userObjectId,
      registeredEmailsData: [newEntry],
    });

    return { created: true, updated: false, added: true };
  }

  // Now check if the regEmail already exists in the array
  const existingEmail = await this.userRegEmailsModel.findOne({
    user: userObjectId,
    'registeredEmailsData.regEmail': newEntry.regEmail
  });

  if (existingEmail) {
    const result = await this.userRegEmailsModel.updateOne(
      {
        user: userObjectId,
        'registeredEmailsData.regEmail': newEntry.regEmail
      },
      {
        $set: {
          ...(newEntry.regEmailName && { 'registeredEmailsData.$.regEmailName': newEntry.regEmailName }),
          ...(newEntry.regEmailRefreshToken && { 'registeredEmailsData.$.regEmailRefreshToken': newEntry.regEmailRefreshToken }),
          ...(newEntry.regEmailPicture && { 'registeredEmailsData.$.regEmailPicture': newEntry.regEmailPicture }),
        }
      }
    );

    return { created: false, updated: true, added: false, modifiedCount: result.modifiedCount };
  } else {
    const result = await this.userRegEmailsModel.updateOne(
      { user: userObjectId },
      {
        $push: {
          registeredEmailsData: newEntry
        }
      }
    );

    return { created: false, updated: false, added: true, modifiedCount: result.modifiedCount };
  }
}


async removeRegisteredEmailData(userId: string, regEmail: string) {
  const result = await this.userRegEmailsModel.updateOne(
    { user: new Types.ObjectId(userId) },
    { $pull: { registeredEmailsData: { regEmail } } }
  );

  return result.modifiedCount > 0;
}


}