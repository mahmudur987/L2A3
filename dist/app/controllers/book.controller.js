"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = __importDefault(require("../models/book.model"));
const borrow_model_1 = __importDefault(require("../models/borrow.model"));
exports.booksRoutes = express_1.default.Router();
// create book
exports.booksRoutes.post("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const result = yield book_model_1.default.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Validation failed",
            error: error,
        });
    }
}));
// get all book
exports.booksRoutes.get("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { genre, sortBy = "title", sort, limit, } = req.query;
    let sortOrder = {};
    if (sortBy && sort) {
        const sortObj = {
            [sortBy]: sort,
        };
        sortOrder = sortObj;
    }
    const result = yield book_model_1.default.find(genre ? { genre } : {})
        .sort(sortOrder ? sortOrder : {})
        .limit(limit ? limit : 0);
    res.status(201).json({
        success: true,
        message: "Book retrieved successfully",
        count: result.length,
        data: result,
    });
}));
// get single book
exports.booksRoutes.get("/books/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const result = yield book_model_1.default.findById(id);
        res.status(201).json({
            success: true,
            message: "Book retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error",
            error: error,
        });
    }
}));
// update book
exports.booksRoutes.patch("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.bookId;
    const updatedDoc = req.body;
    try {
        const result = yield book_model_1.default.findByIdAndUpdate(id, updatedDoc, { new: true });
        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error",
            error: error,
        });
    }
}));
// delete book
exports.booksRoutes.delete("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.bookId;
    try {
        const result = yield book_model_1.default.findByIdAndDelete(id, { new: true });
        res.status(201).json({
            success: true,
            message: "Book deleted successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error",
            error: error,
        });
    }
}));
// create borrow
exports.booksRoutes.post("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const { book: id, quantity } = data;
        const book = yield book_model_1.default.findById(id);
        const { copies } = book;
        const updateStock = copies === 0 && (yield book_model_1.default.updateAvailable(id));
        if (copies && copies >= quantity) {
            const updatePreferredBook = yield book_model_1.default.findByIdAndUpdate(id, {
                copies: copies - quantity,
            }, { new: true });
            const result = yield borrow_model_1.default.create(data);
            res.status(201).json({
                success: true,
                message: "Book borrowed successfully",
                data: result,
                book: updatePreferredBook,
            });
        }
        else {
            res.status(201).json({
                success: false,
                message: `${quantity} copies of book  not available`,
                data: updateStock ? updateStock : null,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error",
            error: error,
        });
    }
}));
// get borrow summary
exports.booksRoutes.get("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield borrow_model_1.default.aggregate([
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
        console.log(book_model_1.default.collection.name);
        res.status(201).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error",
            error: error,
        });
    }
}));
