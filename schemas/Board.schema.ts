import { z } from "zod";

export default z.object({
    name: z.string({
        required_error: "Please enter valid name",
    }).min(1).max(255),
    coverImage: z.string().min(1).max(255).optional(),
    lists: z.array(z.string()).optional(),
});