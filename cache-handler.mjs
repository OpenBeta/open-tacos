import { CacheHandler } from '@neshca/cache-handler'
import createLruHandler from '@neshca/cache-handler/local-lru'
import createRedisHandler from '@neshca/cache-handler/redis-stack'
import { createClient } from 'redis'

CacheHandler.onCreation(async () => {
  let client

  try {
    client = createClient({
      url: process.env.REDIS_URL ?? 'redis://localhost:6379'
    })

    client.on('error', (error) => {
      console.error('Redis error:', error.message)
    })
  } catch (error) {
    console.warn('Failed to create Redis client:', error)
  }

  let redisHandler

  if (process.env.REDIS_AVAILABLE) {
    try {
      console.info('Connecting Redis client...')

      await client.connect()

      console.info('Redis client connected.')

      redisHandler = await createRedisHandler({
        client,
        timeoutMs: 5000
      })
    } catch (error) {
      console.warn('Failed to connect Redis client:', error)
      console.warn('Disconnecting the Redis client...')
      client
        .disconnect()
        .then(() => {
          console.info('  ** Redis client disconnected. **')
        })
        .catch(() => {
          console.warn('Failed to quit the Redis client after failing to connect.')
        })
    }
  }

  const localHandler = createLruHandler()

  return {
    handlers: [redisHandler, localHandler]
  }
})

export default CacheHandler
