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

  if (req.body.type === "Book") {
    const libraryItem = await prisma.libraryItem.create({
      data: {
        title: req.body.title,
        author: req.body.author,
        nbrPages: req.body.nbrPages,
        type: req.body.type,
        categoryId: req.body.categoryId,
        isBorrowable: req.body.isBorrowable,
      },
      include: { category: true },
    });
    return res.status(201).send(libraryItem);
  }

  if (req.body.type === "Encyclopedia") {
    const updatedLibraryItem = await prisma.libraryItem.create({
      data: {
        title: req.body.title,
        author: req.body.author,
        nbrPages: req.body.nbrPages,
        type: req.body.type,
        categoryId: req.body.categoryId,
        isBorrowable: false,
        borrower: null,
        borrowDate: null,
      },
      include: { category: true },
    });
    return res.send(updatedLibraryItem);
  }

  if (req.body.type === "DVD" || req.body.type === "Audiobook") {
    const libraryItem = await prisma.libraryItem.create({
      data: {
        title: req.body.title,
        creator: req.body.creator,
        runTimeMinutes: req.body.runTimeMinutes,
        type: req.body.type,
        categoryId: req.body.categoryId,
        isBorrowable: req.body.isBorrowable,
      },
      include: { category: true },
    });

    return res.status(201).send(libraryItem);
  }
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

  if (req.body.type === "Book") {
    const updatedLibraryItem = await prisma.libraryItem.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        creator: null,
        author: req.body.author,
        nbrPages: req.body.nbrPages,
        type: req.body.type,
        categoryId: req.body.categoryId,
        isBorrowable: req.body.isBorrowable,
      },
      include: { category: true },
    });
    return res.send(updatedLibraryItem);
  }

  if (req.body.type === "Encyclopedia") {
    const updatedLibraryItem = await prisma.libraryItem.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        creator: null,
        author: req.body.author,
        nbrPages: req.body.nbrPages,
        type: req.body.type,
        categoryId: req.body.categoryId,
        isBorrowable: false,
        borrower: null,
        borrowDate: null,
      },
      include: { category: true },
    });
    return res.send(updatedLibraryItem);
  }

  if (req.body.type === "DVD" || req.body.type === "Audiobook") {
    const updatedLibraryItem = await prisma.libraryItem.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        author: null,
        creator: req.body.creator,
        runTimeMinutes: req.body.runTimeMinutes,
        type: req.body.type,
        categoryId: req.body.categoryId,
        isBorrowable: req.body.isBorrowable,
      },
      include: { category: true },
    });

    return res.send(updatedLibraryItem);
  }
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
