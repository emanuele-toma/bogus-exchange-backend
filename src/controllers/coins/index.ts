import { Router } from 'express';
import { history } from './history';
import { list } from './list';
import { search } from './search';
import { single } from './single';

export const coinsRouter = Router();

coinsRouter.use(history);
coinsRouter.use(list);
coinsRouter.use(search);
coinsRouter.use(single);
