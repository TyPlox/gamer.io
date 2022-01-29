import PollSchema from "../schemas/poll.schema";
import Response from "../../../interfaces/response.interface";

export default class PollCrud {

    public static async getById(guildId: string) {
        return PollSchema.findOne({guildId}).exec();
    }

    public static async addVote(guildId: string, userId: string, option: string): Promise<Response> {
        const poll = await PollCrud.getById(guildId);
        if (poll) {
            if (poll.options.toObject().find((e: string) => e === option) === undefined) {
                return {ok: false, msg: `The ${option} option doesn't exist`};
            }
            const vote = poll.respondent.toObject().find((e: {userId: string}) => e.userId === userId);
            if (vote) {
                poll.respondent.pull(vote._id);
                poll.respondent.push({
                    userId,
                    vote: option
                });
                poll.save().then(() => {
                    console.log('saved!')
                });
                return {ok: true, msg: `Your vote has been updated to ${option}`};
            } else {
                poll.respondent.push({
                    userId,
                    vote: option
                });
                poll.save().then(() => {
                    console.log('saved!')
                });
                return {ok: true, msg: `You voted for ${option}`}
            }
        } else {
            return {ok: false, msg: `There is currently no active polls`};
        }
    }

    public static async post(guildId: string, name: string, options: string[], hide: boolean) {
        return PollSchema.create({
            guildId,
            name,
            options,
            hide
        });
    }

    public static async delete(guildId: string) {
        return PollSchema.deleteOne({guildId});
    }

}