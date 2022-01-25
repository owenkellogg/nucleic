
import { DefaultCrawler } from '..'

class NucleicCrawler extends DefaultCrawler {

  query: {
    "out.s1": "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut"
  }

  async onTransaction(tx) {

    console.log(tx)
  }

}

(async () => {

  const token = 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiIxRlRyUWRaRjczd21tSFpVbzRhQzI1a0JWNUprWFRoeGl3IiwiaXNzdWVyIjoiZ2VuZXJpYy1iaXRhdXRoIn0.SHovaVkvTncvNmI0M1Q4WFZ0Ulk2SHdEMXQzOGM1RHJkVTFoTEYyLzhJeEhGZzJsSDQxeldzRG1vdUttemJPb2pJTXd4aVM5Qk9VNjFQNUhJK2x6bUxNPQ'


  const crawler = new NucleicCrawler({
    planariaToken: token,
    query: {
      "out.s2": "nucleic"
    }
  })

  await crawler.start()

})()

