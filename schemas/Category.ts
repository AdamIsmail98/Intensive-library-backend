import { z } from "zod";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
});

export type CategoryData = z.infer<typeof schema>;

export function validate(body: CategoryData) {
  return schema.safeParse(body);
}
