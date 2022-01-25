
import { Cache } from './crawler_base'

const redis = require('async-redis')

export interface RedisParams {
  url: string;
  key: string;
}

export class RedisCache implements Cache {

  params: any;

  key: string;

  client: any;

  constructor(params: RedisParams) {
    this.params = params
    this.key = params.key
    this.client = redis.createClient({ url: params.url })
  }

  async getBlockHeight() {

    let value = await this.client.get(this.params.key)

    if (!value) {

      value = 0

      await this.client.set(this.params.key, value)
    }

    return parseInt(value)

  }
  async setBlockHeight(value) {

    let resp = await this.client.set(this.params.key, value)

    return true

  }

}

