import 'dotenv/config'
import { env } from './utils/envShema'
import TelegramBot, { Message } from 'node-telegram-bot-api'
import { UserController } from './controllers/userController'
import { CommandController } from './controllers/commandController'
import { ExpenseController } from './controllers/expenseController'

class Bot {
  private bot: TelegramBot
  private userController: UserController
  private commandController: CommandController
  private expenseController: ExpenseController

  constructor() {
    this.bot = new TelegramBot(env.TELEGRAM_TOKEN, { polling: true })
    this.userController = new UserController()
    this.commandController = new CommandController()
    this.expenseController = new ExpenseController()

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

      if (!match) {
        return sendMessage('Por favor, envie no formato: /add uber 34.90.')
      }

      const [expenseName, expenseAmount] = match[1].split(' ')

      if (!expenseName || !expenseAmount) {
        return this.commandController.formatExpenseIvalid(sendMessage)
      }

      const expense = {
        name: expenseName,
        amount: expenseAmount,
      }

      this.expenseController.create(userId, expense, sendMessage)
    })

    this.bot.onText(/\/finances/, (msg) => {
      const { userId, sendMessage } = this.getMessage(msg)

      this.expenseController.getAllExpenses(userId, sendMessage)
    })

    this.bot.onText(/\/profile/, (msg) => {
      const { userId, username, sendMessage } = this.getMessage(msg)

      this.userController.profile(userId.toString(), username, sendMessage)
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
      this.bot.sendMessage(userId, text)
    }

    return { userId, username, sendMessage }
  }
}

const botTelegram = new Bot()
