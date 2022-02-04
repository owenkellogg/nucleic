
import { PrivKey, Address } from 'bsv';

import { readFileSync, existsSync, mkdirSync, writeFileSync, createWriteStream } from 'fs';

import { join } from 'path';

import axios from 'axios'

export class NucleicAppOptions {
  app_name: string;
  create_index_html?: boolean = true;
  privatekey?: PrivKey;
}

export class NucleicApp {

  directory: string;
  app_name: string;
  options: NucleicAppOptions;

  private privatekey: PrivKey;

  constructor(options: NucleicAppOptions) {
    this.app_name = options.app_name;
    this.options = options;

    if (this.options.privatekey) {

      this.privatekey = this.options.privatekey  

    } else {

      this.privatekey = new PrivKey().fromRandom()

    }

  }

  get address(): Address {
    return new Address().fromPrivKey(this.privatekey)
  }

  static async load(): Promise<NucleicApp> {

    let config = JSON.parse(readFileSync(join(process.cwd(), '.nucleic', 'config.json')).toString())

    let privatekey = new PrivKey().fromWif(config.privatekey)

    return new NucleicApp({
      app_name: config.app_name,
      privatekey
    })

  }

  static async create(options: NucleicAppOptions): Promise<NucleicApp> {

    if (!options.privatekey) {

      options.privatekey = new PrivKey.fromRandom()

    }

    let app = new NucleicApp(options)

    app.createDirectory()

    app.createNucleicSubdirectory()

    app.createNucleicConfig()

    await app.cloneDefaultIndexHtml()

    return app

  }

  private createDirectory() {

    let directory = join(process.cwd(), this.app_name)

    if (existsSync(directory)){

      console.log(`${this.app_name} directory already exists`)

      process.exit(1)

    } else {

      mkdirSync(directory);

      console.log(`${this.app_name} directory created`)
    }
  }

  private createNucleicSubdirectory() {

    let directory = join(process.cwd(), this.app_name, '.nucleic')

    if (existsSync(directory)){

      console.log(`${this.app_name}/.nucleic directory already exists`)

      process.exit(1)

    } else {

      mkdirSync(directory);

      console.log(`${this.app_name}/.nucleic directory created`)
    }

  }

  private createNucleicConfig() {

    let filepath = join(process.cwd(), this.app_name, '.nucleic', 'config.json')

    if (existsSync(filepath)){

      console.log(`${this.app_name}/.nucleic/config.json already exists`)

    } else {

      let fileContent = JSON.stringify({
        app_name: this.app_name,
        privatekey: this.privatekey.toString(),
        address: this.address.toString()
      }, null, 4)

      writeFileSync(filepath, fileContent)

      console.log(`${filepath} created`)

      console.log(`\nYour App "${this.app_name}" owns the following address\n\n`)
      console.log(`\t${this.address.toString()}\t\n\n`)
      console.log(`Send BSV to your address and then run 'nucliec deploy'\n`)

    }

  }

  async cloneDefaultIndexHtml() {

    return new Promise(async (resolve, reject) => {

      let { data } = await axios({
        url: 'https://nucleic.app/1FqZLqshdqutun95wYgg7bQKvQ3FMFdxLu',
        method: 'GET',
        responseType: 'stream'
      })

      let file = createWriteStream(`${process.cwd()}/${this.app_name}/index.html`)

      data.pipe(file)
        .on('end', resolve)
        .on('error', reject)

    })

  }

}

