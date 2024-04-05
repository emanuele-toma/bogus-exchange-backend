import redis_cache from 'express-redis-cache';
export const cache = redis_cache({ host: 'cache', expire: 300 });
