import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@InjectRedis() private readonly client: Redis) {}

  async set(key: string, value: string, expirationInSeconds?: number) {
    try {
      if (expirationInSeconds) {
        await this.client.set(key, value, 'EX', expirationInSeconds);
      } else {
        await this.client.set(key, value);
      }
      this.logger.log(`Set key: ${key} (TTL: ${expirationInSeconds || 'No Expiration'})`);
    } catch (error) {
      this.logger.error(`Error setting key ${key}: ${error.message}`);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      this.logger.log(`Get key: ${key} -> ${value ? 'Found' : 'Not Found'}`);
      return value;
    } catch (error) {
      this.logger.error(`Error getting key ${key}: ${error.message}`);
      return null;
    }
  }

  async del(key: string) {
    try {
      await this.client.del(key);
      this.logger.log(`Deleted key: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}: ${error.message}`);
    }
  }

  async flushAll() {
    try {
      await this.client.flushall();
      this.logger.warn(`Redis cache flushed!`);
    } catch (error) {
      this.logger.error(`Error flushing Redis: ${error.message}`);
    }
  }
}
