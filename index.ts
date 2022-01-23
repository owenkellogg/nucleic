
import { EventEmitter } from 'events'

import * as split2 from 'split2'

import * as through2 from 'through2'

import axios from 'axios'

interface CrawlerParams {
  query?: any;
  onTransaction: Function
}

export abstract class PlanariaCrawler extends EventEmitter{

  block_height: number = 0;

  cache_key: string = 'planaria_crawler_base';

  query: string;

  abstract onTransaction(any): Promise<any>;

  async start() {

    await axios({
      url: "https://txo.bitbus.network/block",
      method: "post",
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        'token': 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxRlRyUWRaRjczd21tSFpVbzRhQzI1a0JWNUprWFRoeGl3IiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SHovaVkvTncvNmI0M1Q4WFZ0Ulk2SHdEMXQzOGM1RHJkVTFoTEYyLzhJeEhGZzJsSDQxeldzRG1vdUttemJPb2pJTXd4aVM5Qk9VNjFQNUhJK2x6bUxNPQ'
      },
      responseType: 'stream',
      data: this.query
    })
    .then(async ({data}) => {
      data
        .pipe(split2())
        .pipe(through2(async (chunk, enc, callback) => {
          let json = JSON.parse(chunk.toString())

          this.emit('chunk', json)
          await this.onTransaction(json)
          callback()
        }))

     })

    return this

  }

  abstract cacheBlockHeight(): Promise<any>;

}
