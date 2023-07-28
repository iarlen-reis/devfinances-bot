import 'dotenv/config'
import { env } from './utils/envShema'
import TelegramBot, { Message } from 'node-telegram-bot-api'
import { UserController } from './controllers/userController'
import { ExpenseController } from './controllers/expenseController'
import { CommandController } from './controllers/commandController'

class Bot {
  private bot: TelegramBot
  private userController: UserController
  private commandController: CommandController
  private expenseController: ExpenseController

  constructor() {
    this.bot = new TelegramBot(env.TELEGRAM_TOKEN, { polling: true })
    this.userController = new UserController()
    this.commandController = new CommandController()
    this.expenseController = new ExpenseController(
      this.userController,
      this.commandController,
    )

    this.start()
  }

  start() {
    this.bot.onText(/\/start/, (msg) => {
      const { username, sendMessage, userId } = this.getMessage(msg)

      this.userController.wellcome(userId, username, sendMessage)
    })

    this.bot.onText(/\/help/, (msg) => {
      const { sendMessage } = this.getMessage(msg)

      this.commandController.allCommands(sendMessage)
    })

    this.bot.onText(/\/add (.+)/, (msg, match) => {
      const { userId, sendMessage } = this.getMessage(msg)

      this.expenseController.create({ userId, match, sendMessage })
    })

    this.bot.onText(/\/finance (.+)/, (msg, match) => {
      const { userId, sendMessage } = this.getMessage(msg)

      this.expenseController.getExpense({ userId, match, sendMessage })
    })

    this.bot.onText(/\/remove (.+)/, (msg, match) => {
      const { userId, sendMessage } = this.getMessage(msg)

      this.expenseController.deleteExpense({ userId, match, sendMessage })
    })

    this.bot.onText(/\/finances/, (msg) => {
      const { userId, sendMessage } = this.getMessage(msg)

      this.expenseController.getAllActualMonthExpenses({ userId, sendMessage })
    })

    this.bot.onText(/\/profile/, (msg) => {
      const { userId, username, sendMessage } = this.getMessage(msg)

      this.userController.profile(userId, username, sendMessage)
    })

    this.bot.onText(/\/comandos/, (msg) => {
      const { userId } = this.getMessage(msg)

      this.bot.sendMessage(userId, 'Listas dos comandos:', {
        reply_markup: {
          keyboard: [[{ text: '/help' }, { text: '/comandos' }]],
        },
      })
    })
  }

  getMessage(msg: Message) {
    const { id: userId, first_name: username } = msg.chat

    const sendMessage = (text: string) => {
      this.bot.sendMessage(userId, text, {
        reply_to_message_id: msg.message_id,
      })
    }

    return { userId, username, sendMessage }
  }
}

const botTelegram = new Bot()
