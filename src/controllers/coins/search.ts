import { CONFIG, cache } from '@/config';
import axios from 'axios';
import { coinsRouter } from '.';

coinsRouter.get(
  '/search',
  (req, res, next) => {
    const q = req.query.q;

    if (typeof q !== 'string' || q.trim() === '') {
      return res.status(400).json({
        error: 'Invalid query',
      });
    }

    res.express_redis_cache_name = `coins-search-${q}`;

    next();
  },
  cache.route(),
  async (req, res) => {
    const q = req.query.q;

    const { data } = await axios.get(`${CONFIG.PRIVATE_API_URL}/search?type=ce&term=${q}&limit=10`).catch(error => {
      console.error(error);
      return {
        data: null,
      };
    });

    res.json(data.data);
  },
);
