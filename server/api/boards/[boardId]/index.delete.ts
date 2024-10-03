import {Board} from "~/server/models/Board";

export default defineEventHandler(async (event) => {
    const boardId = getRouterParam(event, "boardId");
    const user = event.context.user;

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