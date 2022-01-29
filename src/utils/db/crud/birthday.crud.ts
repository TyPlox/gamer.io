import BirthdaySchema from "../schemas/birthday.schema";

export default class BirthdayCrud {

    public static async get(guildId: string) {
        return BirthdaySchema.findOne({guildId});
    }

    public static async getById(userId: string, guildId: string) {
        return BirthdaySchema.findOne({userId, guildId});
    }

    public static async post(userId: string, guildId: string, date: string) {

        BirthdaySchema.countDocuments({userId, guildId}).then(async (count) => {
            if(count > 0) {
                await BirthdaySchema.updateOne({userId, guildId}, {$set: {date}});
            } else {
                await BirthdaySchema.create({userId, guildId, date});
            }

        }).catch(async () => {
            console.error('Error!');
        });

    }

}