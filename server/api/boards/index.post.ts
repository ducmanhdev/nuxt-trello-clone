import {Board} from "~/server/models/Board";
import type {UserDocument} from "~/server/models/User";
import BoardSchema from "~/schemas/Board.schema";

export default defineEventHandler(async (event) => {
    const user = event.context.user as UserDocument;
    const body = await readValidatedBody(event, body => BoardSchema.parse(body));
    return await Board.create({
        ...body,
        owner: user._id,
    });
});