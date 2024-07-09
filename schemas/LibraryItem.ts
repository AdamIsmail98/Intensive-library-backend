import { z } from "zod";

const baseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  type: z.enum(["Book", "DVD", "Audiobook", "Encyclopedia"]),
  isBorrowable: z.boolean(),
  categoryId: z.string().min(1, { message: "CategoryId is required" }),
});

const bookSchema = baseSchema.extend({
  type: z.literal("Book"),
  author: z.string().min(1, { message: "Author is required" }),
  nbrPages: z.number().min(1, { message: "NbrPages is required" }),
});

const dvdSchema = baseSchema.extend({
  type: z.literal("DVD"),
  runTimeMinutes: z.number().min(1, { message: "RunTimeMinutes is required" }),
  creator: z.string().min(1, { message: "Creator is required" }).optional(), // or .optional() if you allow empty creator
});

const audiobookSchema = baseSchema.extend({
  type: z.literal("Audiobook"),
  runTimeMinutes: z.number().min(1, { message: "RunTimeMinutes is required" }),
  creator: z.string().min(1, { message: "Creator is required" }).optional(), // or .optional() if you allow empty creator
});

const encyclopediaSchema = baseSchema.extend({
  type: z.literal("Encyclopedia"),
  author: z.string().min(1, { message: "Author is required" }),
  nbrPages: z.number().min(1, { message: "NbrPages is required" }),
});

const schemas = {
  Book: bookSchema,
  DVD: dvdSchema,
  Audiobook: audiobookSchema,
  Encyclopedia: encyclopediaSchema,
};

export type LibraryItemData = z.infer<typeof baseSchema>;

export function validate(body: LibraryItemData) {
  const schema = schemas[body.type as keyof typeof schemas];

  return schema.safeParse(body);
}
