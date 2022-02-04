#!/usr/bin/env node

require('dotenv').config()

import { program } from 'commander'

import { NucleicApp } from '../app'

import { publish } from '../message'

import { Actor } from '../actor'

import { join } from 'path'

import { readFileSync } from 'fs'

import * as filepay from 'filepay'

program
  .option('-k, --key <author_private_key>')
  .option('-p, --purse <purse_private_key>')

function getActor(options) {

  var owner = options['key']

  if (!owner) {
    owner = process.env.NUCLEIC_AUTHOR_PRIVATE_KEY
  }

  if (!owner) {

    try {

      let {privatekey} = JSON.parse(readFileSync(join(
        process.cwd(),
        '.nucleic',
        'config.json'
      )).toString('utf8'))

      owner = privatekey

    } catch(error) {

    }

  }

  if (!owner) {

    throw new Error('either --key argument or NUCLEIC_AUTHOR_PRIVATE_KEY environment variable required')

  }

  var purse = options['purse']

  if (!purse) {

    purse = process.env.NUCLEIC_PURSE_PRIVATE_KEY

  }

  if (!purse) {

    purse = owner

  }

  let actor = new Actor({
    purse,
    owner
  })

  return actor

}

program
  .command('publish <app> <event> <payload>')
  .action(async (app, event, payload) => {

    const options = program.opts()

    const actor = getActor(options)

    try {

      let result = await actor.publishMessage({
        app,
        event,
        payload: JSON.parse(payload)
      })

      console.log('result', result)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

function putFile(params, key): Promise<any> {
  return new Promise(async (resolve, reject) => {

    let result = await filepay.putFile({

      file: params,

      pay: {
        key
      }

    }, (err, txid) => {
      console.log(err, txid)

      if (err) {
        console.error('filepay error', err)
        reject(new Error('filepay error'))
      } else {
        resolve(txid)
      }

    })

  })
}

program
  .command('deploy [file]')
  .action(async (file='index.html') => {

    const options = program.opts()

    let actor = getActor(options)

    try {
      var filepath;

      if (file) {

        if (file.match('$\/')) {

          filepath = options.file

        } else {

          filepath = join(process.cwd(), file)
        }

      }

      let content = readFileSync(filepath).toString()

      const key = actor.purse.toString()

      try {

        let txid = await putFile({
          content,
          contentType: 'text/html',
          encoding: 'utf8',
          name: 'index.html'
        }, key)

        console.log('txid', txid)

        const actor = getActor(options)

        let result = await actor.publishMessage({
          app: 'nucleic.app',
          event: 'set_index_html',
          payload: {
            b_file: txid
          }
        })

        console.log(result)

      } catch(error) {

        console.error('error', error)

      }

    } catch(error) {

      console.error('error', error)

    }

    process.exit(0)

  })


program
  .command('new <app_name>')
  .action(async (app_name) => {

    await NucleicApp.create({ app_name })

    process.exit(0)

  })

program
  .command('address')
  .action(async () => {

    let app = await NucleicApp.load()

    console.log(`\n Your app's address is: \n`)

    console.log(`${app.address.toString()}\n`)

    process.exit(0)

  })


program.parse(process.argv)
