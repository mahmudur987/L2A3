"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const book_controller_1 = require("./app/controllers/book.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// middleware
dotenv_1.default.config();
app.use("/api", book_controller_1.booksRoutes);
app.get("/", (req, res) => {
    res.send("Welcome to library maintenances App");
});
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route  not found`,
    });
});
app.use((err, req, res, next) => {
    return res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
});
exports.default = app;
