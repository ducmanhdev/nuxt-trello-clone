import {Board} from "~/server/models/Board";
import type {UserDocument} from "~/server/models/User";

export default defineEventHandler(async (event) => {
    const user = event.context.user as UserDocument;
    const boardId = getRouterParam(event, "boardId");

    const deletedBoard = await Board.findOneAndDelete({
        _id: boardId,
        owner: user._id,
    });

    if (!deletedBoard) {
        throw createError({
            statusCode: 404,
            message: "Board not found",
        });
    }

    event.node.res.statusCode = 204;

    return true;
});