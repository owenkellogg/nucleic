
import { EventEmitter } from 'events'

import * as split2 from 'split2'

import * as through2 from 'through2'

import axios from 'axios'

import { CrawlerBase } from './crawler_base'

import { RedisCache, RedisParams} from './redis_cache'

interface Params {
  cache?: RedisParams;
  planariaToken: string;
  query: any;
}

export class DefaultCrawler extends CrawlerBase {

  constructor(params: Params) {

    super(params.planariaToken)

    console.log('THIS', this)

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

