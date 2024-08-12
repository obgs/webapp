import { z } from "zod";

export const aggregateStatSchema = z.object({
  aggregateStats: z.array(
    z.object({
      id: z.string().nonempty(),
      name: z.string().nonempty("Name is required"),
      description: z.string().optional(),
      orderNumber: z.number(),
      references: z.string().nonempty().array().min(2),
    })
  ),
});

export type AggregateStatsValues = z.infer<typeof aggregateStatSchema>;
