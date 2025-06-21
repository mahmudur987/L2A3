import express, { Request, Response } from "express";
import Book from "../models/book.model";
import Borrow from "../models/borrow.model";

export const booksRoutes = express.Router();
// create book
booksRoutes.post("/books", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const result = await Book.create(body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Validation failed",
      error: error,
    });
  }
});
// get all book
booksRoutes.get("/books", async (req: Request, res: Response) => {
  const {
    sortBy = "title",
    sort,
    limit,
    ...filters
  }: {
    genre?: string;
    sortBy?: string;
    sort?: string;
    limit?: number;
  } = req.query;
  console.log(filters);
  let sortOrder: {} = {};
  if (sortBy && sort) {
    const sortObj = {
      [sortBy]: sort,
    };
    sortOrder = sortObj;
  }

  const result = await Book.find(filters ? filters : {})
    .sort(sortOrder ? sortOrder : {})
    .limit(limit ? limit : 0);
  res.status(201).json({
    success: true,
    message: "Book retrieved successfully",
    data: result,
  });
});
// get single book
booksRoutes.get("/books/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await Book.findById(id);
    res.status(201).json({
      success: true,
      message: "Book retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error",
      error: error,
    });
  }
});
// update book
booksRoutes.put("/books/:bookId", async (req: Request, res: Response) => {
  const id = req.params.bookId;
  const updatedDoc = req.body;
  try {
    const result = await Book.findByIdAndUpdate(id, updatedDoc, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      success: true,
      message: "Book updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error",
      error: error,
    });
  }
});
// delete book
booksRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  const id = req.params.bookId;

  try {
    const result = await Book.findByIdAndDelete(id, { new: true });
    res.status(201).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error",
      error: error,
    });
  }
});

// create borrow

booksRoutes.post("/borrow", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { book: id, quantity } = data;
    const book: any = await Book.findById(id);
    const { copies } = book;

    const updateStock = copies === 0 && (await Book.updateAvailable(id));

    if (copies && copies >= quantity) {
      const updatePreferredBook = await Book.findByIdAndUpdate(
        id,
        {
          copies: copies - quantity,
        },
        { new: true }
      );
      const result = await Borrow.create(data);
      res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: result,
      });
    } else {
      res.status(201).json({
        success: false,
        message: `${quantity} copies of book  not available`,
        data: updateStock ? updateStock : null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error",
      error: error,
    });
  }
});

// get borrow summary

booksRoutes.get("/borrow", async (req: Request, res: Response) => {
  try {
    const result = await Borrow.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "BookInfo",
        },
      },
      { $unwind: "$BookInfo" },
      {
        $group: {
          _id: { title: "$BookInfo.title", isbn: "$BookInfo.isbn" },
          totalQuantity: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          book: { title: "$_id.title", isbn: "$_id.isbn" },
          totalQuantity: 1,
        },
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error",
      error: error,
    });
  }
});
