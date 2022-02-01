
import * as bsv from 'bsv'

import * as filepay from 'filepay'

import * as uuid from 'uuid'

import { Bsv } from 'bsv'

interface NewMessage {
  app: string;
  event: string;
  payload: any;
  nonce?: string;
}

interface BlockchainMessage extends NewMessage {
  txid: string;
  vout: number;
  script: string;
  author?: string;
}

interface ActorParams {
  purse: string;
  owner: string;
}

export const authorIdentityPrefix = '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva';

export class Actor {

  purse: bsv.PrivKey;
  owner: bsv.PrivKey;

  constructor(options: ActorParams) {
    this.purse = new bsv.PrivKey().fromWif(options.purse)
    this.owner = new bsv.PrivKey().fromWif(options.owner)
  }

  get identity() {
    return new bsv.Address().fromPrivKey(this.owner).toString()
    
  }

  publishMessage(newMessage: NewMessage): Promise<BlockchainMessage> {

    return new Promise((resolve, reject) => {

      newMessage.nonce = newMessage.nonce || uuid.v4()

      const keypair = new bsv.KeyPair().fromPrivKey(this.owner)

      const payloadToSign = JSON.stringify(Object.assign(newMessage.payload, {
        nucleic_app: newMessage.app,
        nucleic_event: newMessage.event,
        nucleic_nonce: newMessage.nonce
      }))

      const signature = bsv.Bsm.sign(Buffer.from(payloadToSign), keypair)

      let address = new bsv.Address().fromString(this.identity)

      let verified = bsv.Bsm.verify(Buffer.from(payloadToSign, 'utf8'), signature, address)

      if (!verified) {
        throw new Error('SIGNATURE NOT VERIFIED')
      }

      const params = {
        pay:  {
          key: this.purse.toWif(),
          to: [{

            data: [
              'nucleic',
              newMessage.app,
              newMessage.event,
              payloadToSign,
              "|",
              authorIdentityPrefix,
              "BITCOIN_ECDSA",
              this.identity,
              signature,
              0x05 // signed index #5 "payloadToSign"
            ],

            value: 0
          }]
        }


      };

      filepay.send(params, (error, tx) => {
        console.log(error, tx)

        if (error) { return reject(error.response) }

        resolve(tx)

      })

    })

  }

}

