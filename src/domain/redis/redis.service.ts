import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor( private readonly configService: ConfigService) {
    const redisHost = this.configService.get<string>("REDIS_HOST");
    if (!redisHost) {
        throw new Error("REDIS_HOST is not defined in the configuration");
    }
    this.client = new Redis(redisHost).on("error", (error) => {
        Logger.error(error);
    });
  }

  async set(key: string, value: string, ttlSeconds = 3600): Promise<void> {
    await this.client.set(key, value, 'EX', ttlSeconds);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

}