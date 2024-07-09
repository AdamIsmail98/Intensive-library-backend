import express from "express";
import { PrismaClient } from "@prisma/client";
import { validate } from "../schemas/Category";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany();
  return res.send(categories);
});

router.get("/:id", async (req, res) => {
  const category = await prisma.category.findFirst({
    where: { id: req.params.id },
  });

  if (!category) return res.status(404).send("Category item not found");

  return res.send(category);
});

router.post("/", async (req, res) => {
  const validation = validate(req.body);

  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const category = await prisma.category.findFirst({
    where: { name: req.body.name },
  });

  if (category) return res.status(400).send("Category already exists");

  const newCategory = await prisma.category.create({
    data: {
      name: req.body.name,
    },
  });

  res.status(201).send(newCategory);
});

router.put("/:id", async (req, res) => {
  const category = await prisma.category.findFirst({
    where: { id: req.params.id },
  });

  if (!category) return res.status(404).send("Category not found");

  const validation = validate(req.body);

  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const updatedCategory = await prisma.category.update({
    where: {
      id: req.params.id,
    },
    data: {
      name: req.body.name,
    },
  });

  res.status(201).send(updatedCategory);
});

router.delete("/:id", async (req, res) => {
  const category = await prisma.category.findFirst({
    where: { id: req.params.id },
    include: {
      items: true,
    },
  });

  if (!category) return res.status(404).send("Category not found");

  if (category.items.length > 0)
    return res
      .status(400)
      .send("Cannot delete category linked with library items");

  const deletedCategory = await prisma.category.delete({
    where: { id: req.params.id },
  });

  return res.send(deletedCategory);
});

export default router;
