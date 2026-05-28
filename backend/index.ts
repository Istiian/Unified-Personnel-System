import express ,{Request, Response} from 'express';
import dotenv from 'dotenv';
import personRoutes from './src/modules/Person/person.routes';
import authRoutes from './src/modules/auth/auth.routes';
import { errorMiddleware } from './src/middleware/errorHandler';
// import { db } from './src/db/client';
// import studentRoutes from './src/modules/Student/student.router';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/person', personRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/student', studentRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Worldd!');
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


