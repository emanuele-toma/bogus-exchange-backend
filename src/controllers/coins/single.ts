import { cache, CONFIG } from '@/config';
import axios from 'axios';
import { coinsRouter } from '.';

coinsRouter.get(
  '/:code',
  (req, res, next) => {
    const code = req.params.code;

    if (typeof code !== 'string' || code.trim() === '') {
      return res.status(400).json({
        error: 'Invalid code',
      });
    }

    res.express_redis_cache_name = `coins-single-${code}`;

    next();
  },
  cache.route(),
  async (req, res) => {
    const code = req.params.code.toUpperCase();

    const { data } = await axios
      .post(
        `${CONFIG.API_URL}/coins/single`,
        {
          currency: 'USD',
          code,
          meta: true,
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
