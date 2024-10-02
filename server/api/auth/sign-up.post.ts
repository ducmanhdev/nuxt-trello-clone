import {User} from "~/server/models/User";

export default defineEventHandler(async (event) => {
    const data = await readBody(event);
    const user = await User.create(data);

    return {
        ...user.toJSON(),
        password: undefined,
    }
});