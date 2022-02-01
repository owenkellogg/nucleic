
import { Actor } from './actor'

interface NewMessage {
  app: string;
  event: string;
  payload: any;
  author?: string;
}

interface Action extends NewMessage {
  txid: string;
  vout: number;
  script?: string;
  author?: string;
  signature?: string;
  signed_message?: string;
}

export { Action }

export async function publish(message: NewMessage): Promise<Action> {

  let actor = new Actor({
    purse: process.env.ACTOR_PRIVATE_KEY,
    owner: process.env.ACTOR_PRIVATE_KEY
  })

  return actor.publishMessage(message)

}

