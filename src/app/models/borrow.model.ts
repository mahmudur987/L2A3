import mongoose, { Schema, SchemaType } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Book",
    },
    quantity: {
      type: Number,
      min: [1, "you should borrow at least one book"],
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value >= new Date();
        },
        message: "Due date must be in the future",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Borrow = mongoose.model<IBorrow>("Borrow", borrowSchema);

export default Borrow;
