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

    this.bot.onText(/\/ajuda/, (msg) => {
      const { sendMessage } = this.getMessage(msg)

      this.commandController.allCommands(sendMessage)
    })

    this.bot.onText(/\/criar (.+)/, (msg, match) => {
      const { userId, sendMessage } = this.getMessage(msg)

      this.expenseController.create({ userId, match, sendMessage })
    })

    this.bot.onText(/\/gastos/, (msg) => {
      const { userId, sendMessage } = this.getMessage(msg)

      this.expenseController.getAllActualMonthExpenses({ userId, sendMessage })
    })

    this.bot.onText(/\/gasto (.+)/, (msg, match) => {
      const { userId, sendMessage } = this.getMessage(msg)

      this.expenseController.getExpense({ userId, match, sendMessage })
    })

    this.bot.onText(/\/deletar (.+)/, (msg, match) => {
      const { userId, sendMessage } = this.getMessage(msg)

      this.expenseController.deleteExpense({ userId, match, sendMessage })
    })

    this.bot.onText(/\/perfil/, (msg) => {
      const { userId, username, sendMessage } = this.getMessage(msg)

      this.userController.profile(userId, username, sendMessage)
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
