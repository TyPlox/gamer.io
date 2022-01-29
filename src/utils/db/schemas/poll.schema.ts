import {model, Schema, Document, Types} from 'mongoose';

interface IRespondent extends Document {
    userId: string;
    vote: string;
}

interface IPoll extends Document {
    name: string;
    guildId: string;
    options: Types.DocumentArray<string>;
    hide: boolean;
    respondent: Types.DocumentArray<IRespondent>;
}

export default model<IPoll>("Poll",
    new Schema({
        name: String,
        guildId: String,
        options: [{
            type: String
        }],
        hide: Boolean,
        respondent: [{
            userId: String,
            vote: String
        }]
    })
);