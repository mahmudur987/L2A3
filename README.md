# 📚 Advanced Note App with Mongoose

A simple Node.js and Express application for managing a book library, built using TypeScript, Mongoose (MongoDB), and RESTful APIs.

## 🚀 Features

- Add, update, delete, and retrieve books.
- Filter and sort books .
- Borrow books while tracking available copies.
- Automatic book availability updates.
- Generate summarized reports of borrowed books using MongoDB aggregation.

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- ESLint & Prettier

## 📁 Folder Structure

src/
│
├── controllers/ # Route handlers
├── models/ # Mongoose schemas and models
├── interfaces/ # TypeScript interfaces
└── app.ts # Express app entry point

## 📌 API Endpoints

### 📘 Books

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| POST   | `/books`         | Create a new book            |
| GET    | `/books`         | Get all books (with filters) |
| GET    | `/books/:id`     | Get a single book            |
| PATCH  | `/books/:bookId` | Update a book                |
| DELETE | `/books/:bookId` | Delete a book                |

#### Query Parameters for `/books`

- `genre` - Filter books by genre.
- `sortBy` - Sort books by a field (e.g., `title`).
- `sort` - Sort order (`asc` or `desc`).
- `limit` - Limit number of results.

### 📙 Borrow

| Method | Endpoint  | Description                 |
| ------ | --------- | --------------------------- |
| POST   | `/borrow` | Borrow a book               |
| GET    | `/borrow` | Get borrow summary (report) |

## 📄 Book Schema

{
title: String,
author: String,
genre: "FICTION" | "NON_FICTION" | "SCIENCE" | "HISTORY" | "BIOGRAPHY" | "FANTASY",
isbn: String,
description?: String,
copies: Number,
available: Boolean
}

🔄 Borrow Schema
ts
Copy
Edit
{
book: ObjectId (Reference to Book),
quantity: Number,
dueDate: Date
}
###🧪 Linting
This project uses ESLint with TypeScript.

npm run lint

###🌐 Deployment
This app is deployed using Vercel.domain is "[Click here](https://l2-a3-amber.vercel.app/)"

###📦 Installation
bash
Copy
Edit
git clone https://github.com/mahmudur987/L2A3.git
cd L2A3
npm install
npm run dev
