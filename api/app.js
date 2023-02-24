// Environment variables setup
import dotenv from 'dotenv';
dotenv.config();

// Express app setup
import express from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// MongoDB setup
// import mongoose from 'mongoose';
// mongoose.set('strictQuery', true);
// mongoose.connect('mongodb://127.0.0.1:27017/86it');
// mongoose.connection.on('error', (error) => {
//   console.log(`Mongo DB Connection Error: ${error}`);
// });

// API routes
app.get('/api/hello', (req, res) => {
  res.json({ message: `Hello from 86it!` });
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
