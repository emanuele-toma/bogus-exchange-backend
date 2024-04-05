import { CONFIG, cache } from '@/config';
import axios from 'axios';
import { Router } from 'express';

export const list = Router();

list.get(
  '/list',
  (req, res, next) => {
    // get offset from query params
    const page = req.query.page || 1;

    // check if page is a number else return 400
    if (isNaN(parseInt(page.toString()))) {
      return res.status(400).json({
        error: 'Invalid page number',
      });
    }

    // or if page is less than 1 return 400
    if (parseInt(page.toString()) < 1) {
      return res.status(400).json({
        error: 'Page number must be greater than 0',
      });
    }

    res.express_redis_cache_name = `coins-list-${page}`;

    next();
  },
  cache.route(),
  async (req, res) => {
    const page = req.query.page || 1;

    const { data } = await axios
      .post(
        `${CONFIG.API_URL}/coins/list`,
        {
          currency: 'USD',
          limit: 100,
          offset: (page as number) * 100 - 100,
          meta: true,
          sort: 'rank',
          order: 'ascending',
        },
        {
          headers: {
            'x-api-key': CONFIG.API_TOKEN,
          },
        },
      )
      .catch(error => {
        console.error(error);
        return {
          data: null,
        };
      });

    res.json(data);
  },
);
