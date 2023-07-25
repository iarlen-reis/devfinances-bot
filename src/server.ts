import 'dotenv/config'
import { env } from './utils/envShema'
import TelegramBot, { Message } from 'node-telegram-bot-api'
import { UserController } from './controllers/useController'

class Bot {
  private bot: TelegramBot
  private userController: UserController

  constructor() {
    this.bot = new TelegramBot(env.TELEGRAM_TOKEN, { polling: true })
    this.userController = new UserController()

    this.start()
  }

  start() {
    this.bot.onText(/\/start/, (msg) => {
      const { username, sendMessage, userId } = this.getMessage(msg)

      this.userController.register(userId.toString())
      this.userController.wellcome(username, sendMessage)
    })
  }

  getMessage(msg: Message) {
    const { id: userId, first_name: username } = msg.chat

    const sendMessage = (text: string) => {
      this.bot.sendMessage(userId, text)
    }

    return { userId, username, sendMessage }
  }
}

const botTelegram = new Bot()
