
import { CrawlerBase } from '..'

import { MemoryCache } from '../redis_cache'

class NucleicCrawler extends CrawlerBase {

  query: any;

  token: string;

  constructor() {
    super()
    this.planariaToken = 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxRlRyUWRaRjczd21tSFpVbzRhQzI1a0JWNUprWFRoeGl3IiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SHovaVkvTncvNmI0M1Q4WFZ0Ulk2SHdEMXQzOGM1RHJkVTFoTEYyLzhJeEhGZzJsSDQxeldzRG1vdUttemJPb2pJTXd4aVM5Qk9VNjFQNUhJK2x6bUxNPQ'
    this.cache = new MemoryCache()
    this.query = {
      "out.s2": "nucleic"
    }

  }

  async onTransaction(tx) {

    console.log(tx)
  }

}

(async () => {

  const crawler = new NucleicCrawler()

  await crawler.start()

})()

