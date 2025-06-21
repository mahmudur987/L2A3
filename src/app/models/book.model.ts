import mongoose, { Model, Schema } from "mongoose";
import { bookMethod, IBook } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook, bookMethod>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message:
          "Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
      },
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
    copies: {
      type: Number,
      required: [true, "Number of copies is required"],
      min: [0, "Copies must be a positive number"],
    },
    available: {
      type: Boolean,
      required: [true, "Availability status is required"],
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
bookSchema.static("updateAvailable", function updateAvailable(id) {
  const result = this.findByIdAndUpdate(
    id,
    { available: false },
    { new: true }
  );
  return result;
});
const Book = mongoose.model<IBook, bookMethod>("Book", bookSchema);
export default Book;
