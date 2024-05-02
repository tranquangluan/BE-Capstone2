import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  public async get(key: string) {
    return await this.cache.get(key);
  }
  
  public async set(key: string, value: unknown){
    return await this.cache.set(key,value);
  }

  async setObject(key: string, object: any): Promise<void> {
    await this.cache.set(key, JSON.stringify(object));
  }

  async getObject(key: string): Promise<any> {
    const data = await this.cache.get(key);
    return data;
  }
}
