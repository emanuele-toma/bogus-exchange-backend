import { cache, CONFIG } from '@/config';
import axios from 'axios';
import { Router } from 'express';

export const history = Router();

history.get(
  '/:code/history',
  (req, res, next) => {
    const code = req.params.code;

    if (typeof code !== 'string' || code.trim() === '') {
      return res.status(400).json({
        error: 'Invalid code',
      });
    }

    const start = req.query.start;
    const end = req.query.end;

    if (start && isNaN(parseInt(start.toString()))) {
      return res.status(400).json({
        error: 'Invalid start date',
      });
    }

    if (end && isNaN(parseInt(end.toString()))) {
      return res.status(400).json({
        error: 'Invalid end date',
      });
    }

    if ((start && !end) || (!start && end)) {
      return res.status(400).json({
        error: 'Both start and end date must be provided',
      });
    }

    if (start && end && parseInt(start.toString()) > parseInt(end.toString())) {
      return res.status(400).json({
        error: 'Start date must be less than end date',
      });
    }

    const cache_start = parseInt(
      req.query.start?.toString() || (new Date().getTime() - 1000 * 60 * 60 * 24 * 30).toString(),
    );
    const cache_end = parseInt(req.query.end?.toString() || new Date().getTime().toString());

    res.express_redis_cache_name = `coins-single-history-${code}-${cache_start}-${cache_end}`;

    next();
  },
  cache.route(),
  async (req, res) => {
    const code = req.params.code.toUpperCase();

    const start = parseInt(req.query.start?.toString() || (new Date().getTime() - 1000 * 60 * 60 * 24 * 30).toString());
    const end = parseInt(req.query.end?.toString() || new Date().getTime().toString());

    const { data } = await axios
      .post(
        `${CONFIG.API_URL}/coins/single/history`,
        {
          currency: 'USD',
          code,
          start,
          end,
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
