import express from "express";
import { PrismaClient } from "@prisma/client";
import { validate } from "../schemas/LibraryItem";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const libraryitems = await prisma.libraryItem.findMany({
    include: { category: true },
  });
  return res.send(libraryitems);
});

router.get("/:id", async (req, res) => {
  const libraryItem = await prisma.libraryItem.findFirst({
    where: { id: req.params.id },
    include: { category: true },
  });

  if (!libraryItem) return res.status(404).send("Library item not found");

  return res.send(libraryItem);
});

router.post("/", async (req, res) => {
  const validation = validate(req.body);

  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const category = await prisma.category.findFirst({
    where: { id: req.body.categoryId },
  });

  if (!category) return res.status(404).send("Category not found");

  const libraryItem = await prisma.libraryItem.create({
    data: {
      title: req.body.title,
      type: req.body.type,
      categoryId: req.body.categoryId,
      isBorrowable: req.body.isBorrowable,
      author: req.body.author || null,
      creator: req.body.creator || null,
      nbrPages: req.body.nbrPages || null,
      runTimeMinutes: req.body.runTimeMinutes || null,
      borrower: null,
      borrowDate: null,
    },
    include: { category: true },
  });

  return res.status(201).send(libraryItem);
});

router.put("/:id", async (req, res) => {
  const libraryItem = await prisma.libraryItem.findFirst({
    where: { id: req.params.id },
  });

  if (!libraryItem) return res.status(404).send("Library item not found");

  const validation = validate(req.body);

  if (!validation.success)
    return res.status(400).send(validation.error.issues[0].message);

  const category = await prisma.category.findFirst({
    where: { id: req.body.categoryId },
  });

  if (!category) return res.status(404).send("Category not found");

  if (req.body.isBorrowable && req.body.borrower) {
    const updatedLibraryItem = await prisma.libraryItem.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        author: req.body.author || null,
        creator: req.body.creator || null,
        nbrPages: req.body.nbrPages || null,
        runTimeMinutes: req.body.runTimeMinutes || null,
        type: req.body.type,
        categoryId: req.body.categoryId,
        isBorrowable: false,
        borrower: req.body.borrower,
        borrowDate: req.body.borrowDate,
      },
      include: { category: true },
    });

    return res.send(updatedLibraryItem);
  }

  const updatedLibraryItem = await prisma.libraryItem.update({
    where: {
      id: req.params.id,
    },
    data: {
      title: req.body.title,
      author: req.body.author || null,
      creator: req.body.creator || null,
      nbrPages: req.body.nbrPages || null,
      runTimeMinutes: req.body.runTimeMinutes || null,
      type: req.body.type,
      categoryId: req.body.categoryId,
      isBorrowable: req.body.isBorrowable,
      borrower: null,
      borrowDate: null,
    },
    include: { category: true },
  });

  return res.send(updatedLibraryItem);
});

router.delete("/:id", async (req, res) => {
  const libraryItem = await prisma.libraryItem.findFirst({
    where: { id: req.params.id },
  });

  if (!libraryItem) return res.status(404).send("Library item not found");

  const deletedLibraryItem = await prisma.libraryItem.delete({
    where: { id: req.params.id },
  });

  return res.send(deletedLibraryItem);
});

export default router;
