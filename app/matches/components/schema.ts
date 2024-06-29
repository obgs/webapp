import { z } from "zod";

export const schema = z.record(z.record(z.string()));

export type FormValues = z.infer<typeof schema>;
