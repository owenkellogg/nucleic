
import { EventEmitter } from 'events'

import * as split2 from 'split2'

import * as through2 from 'through2'

import axios from 'axios'

import { CrawlerBase, Cache } from './crawler_base'

import { RedisCache, RedisParams, MemoryCache} from './redis_cache'

export { Cache }

interface Params {
  cache?: RedisParams;
  planariaToken: string;
  query: any;
}

export { CrawlerBase }

export class DefaultCrawler extends CrawlerBase {

  cache: Cache;

  constructor(params: Params) {

    super(params.planariaToken)

    this.query = params.query

    console.log(this)

    if (!params.cache && process.env.REDIS_URL) {
      params['cache'] = {
        url: process.env.REDIS_URL,
        key: this.cache_key
      }
    } else {
      throw new Error('REDIS_URL environment variable required')
    }

    this.cache = new RedisCache(
      Object.assign(params.cache, {key: this.cache_key}) 
    );
  }

  async onTransaction(tx) {

    this.emit('transaction', tx)

  }

}

export class Crawler extends CrawlerBase {

  cache: Cache = new MemoryCache();

  query: any;

  planariaToken: string;

  async onTransaction(tx) {

    this.emit('transaction', tx)

  }

}


