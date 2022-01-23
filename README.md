
# Nucleic

For building Bitcoin-powered applications in Node.js Typescript.

### Usage

```
import { PlanariaCrawler } from 'nucleic'

class Crawler extends PlanariaCrawler {

  query: {
    // see https://bitquery.planaria.network for query syntax
  }

  async getBlockIndex() {
    // optional override 
  }

  async setBlockIndex() {
    // optional override 
  }

  async onTransaction(transaction) {
    // override to receive transactions
  }

  async persistTransction(transaction) {
    // optional override to persist transaction if not persisted
  }

}

(aysnc () => {

  let crawler = new Crawler(process.env.PLANARIA_TOKEN)

  // optional event emitter in addition to onTransaction callback
  crawler.on('transaction', (transaction) => {

  })

  // crawler will catch all errors silently and it an error event
  crawler.on('error', (error) => {

  })

  // awaiting crawler will crawl forever until stopped
  crawler.on('transaction', crawler.stop)

  await crawler.start()

}()

```
