import { coinsRouter } from '@/controllers';
import 'dotenv/config';
import express, { Router } from 'express';

const app = express();

/** V1 **/
const v1 = Router();

v1.use('/coins', coinsRouter);

app.use('/api/v1', v1);

app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});
