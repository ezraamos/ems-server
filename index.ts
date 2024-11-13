import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/auth';
import departmentRouter from './routes/department';
import employeeRouter from './routes/employee';
import connectToDatabase from './db/db';
dotenv.config();

const app = express();
app.use(cors());
// parse JSON data in the body of incoming request, making it available as body.json
app.use(express.json());

//Connect to DB
connectToDatabase();

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);

app.use('/test', () => {
  console.log('hello world');
});

app.listen(process.env.PORT, () => {
  console.log(`listing to port ${process.env.PORT}`);
});
