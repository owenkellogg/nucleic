
import { Crawler } from '..'

class NucleicCrawler extends Crawler {

  query: {
    "out.s1": "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut"
  }

  token: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxRlRyUWRaRjczd21tSFpVbzRhQzI1a0JWNUprWFRoeGl3IiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SHovaVkvTncvNmI0M1Q4WFZ0Ulk2SHdEMXQzOGM1RHJkVTFoTEYyLzhJeEhGZzJsSDQxeldzRG1vdUttemJPb2pJTXd4aVM5Qk9VNjFQNUhJK2x6bUxNPQ'

  async onTransaction(tx) {

    console.log(tx)
  }

}

(async () => {



  const crawler = new NucleicCrawler()

  console.log("CACHE", crawler.cache)

  await crawler.start()

})()

