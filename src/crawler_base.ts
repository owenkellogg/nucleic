

import { EventEmitter } from 'events'

import * as split2 from 'split2'

import * as through2 from 'through2'

import axios from 'axios'

interface CrawlerParams {
  query?: any;
  onTransaction: Function
}

export interface Cache {
  getBlockHeight: () => Promise<number>;
  setBlockHeight: (value: number) => Promise<boolean>;
}

export interface Store {
  persistTransction: (tx: any) => Promise<any>;
}

export abstract class CrawlerBase extends EventEmitter {

  block_height: number = 0;

  cache_key: string = 'planaria_crawler_base';

  query: any;

  planariaToken: string;

  store: Store;

  cache: Cache;

  constructor(planariaToken: string) {

    super()

    this.planariaToken = planariaToken

  }

  async start() {

    this.block_height = (await this.getBlockHeight() - 1)

    const query = {
      q: {
        find: Object.assign(this.query, {
          "blk.i": {
            "$gt": this.block_height
          }
        }),
        project: { "blk": 1, "tx.h": 1, "out.s4": 1, "out.o1": 1 }
      },
    }

    const requestParams = {
      url: "https://txo.bitbus.network/block",
      method: "post",
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        'token': `${this.planariaToken}`
      },
      responseType: 'stream',
      data: query
    }

    await axios({
      url: "https://txo.bitbus.network/block",
      method: "post",
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        'token': `${this.planariaToken}`
      },
      responseType: 'stream',
      data: query
    })
    .then(async ({data}) => {
      data
        .pipe(split2())
        .pipe(through2(async (chunk, enc, callback) => {

          let json = JSON.parse(chunk.toString())

          await this.onTransaction(json)

          this.block_height = json.blk.i

          await this.setBlockHeight()

          callback()
        }))

     })
    .catch(console.error)

    return this

  }

  abstract onTransaction(any): Promise<any>;

  setBlockHeight() {

    return this.cache.setBlockHeight(this.block_height)
    
  }

  getBlockHeight() {

    return this.cache.getBlockHeight()

  }


}

