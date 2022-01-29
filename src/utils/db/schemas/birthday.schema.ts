import { model, Schema } from 'mongoose';

interface IBirthday {
    userId: string;
    guildId: string;
    date: string;
}

export default model("Birthday",
    new Schema<IBirthday>({
        userId: String,
        guildId: String,
        date: String
    })
);