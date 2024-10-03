import {Board} from "~/server/models/Board";

export default defineEventHandler(async (event) => {
    const user = event.context.user;

    return Board.find({owner: user._id}).sort({createdAt: -1});
});