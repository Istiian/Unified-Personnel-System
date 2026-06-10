import {errorHandler} from "./middleware/errorHandler";
import express from "express";
import {AppError} from "./utils/AppError";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 404 handler
app.use((req, res, next) => {
    next(new AppError('Not Found', 404));
});

// Error handler
app.use(errorHandler);
