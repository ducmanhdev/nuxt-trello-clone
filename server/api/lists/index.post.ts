import ListSchema from "~/schemas/List.schema";
import {Board} from "~/server/models/Board";
import {List} from "~/server/models/List";
import type {UserDocument} from "~/server/models/User";

export default defineEventHandler(async (event) => {
    const user = event.context.user as UserDocument;
    const body = await readValidatedBody(event, body => ListSchema.parse(body));

    const list = await List.create({
        ...body,
        owner: user._id,
    });

    if (!list) {
        throw createError({
            statusCode: 400,
            message: "Something went wrong",
        });
    }

    await Board.findOneAndUpdate(
        {
            _id: body.board,
            owner: user._id,
        },
        {
            $push: {lists: list._id},
        },
        {
            new: true,
        }
    );

    return list;
});