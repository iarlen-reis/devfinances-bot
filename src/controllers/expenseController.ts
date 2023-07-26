import { prisma } from '../utils/prisma'
import { CommandController } from './commandController'
import { UserController } from './userController'

interface IExpenseProps {
  name: string
  amount: string
}

export class ExpenseController {
  userController: UserController
  commandController: CommandController

  constructor() {
    this.userController = new UserController()
    this.commandController = new CommandController()
  }

  create = async (
    userId: number,
    expense: IExpenseProps,
    sendMessage: (text: string) => void,
  ) => {
    const user = await this.userController.register(userId)

    const creatingExpense = await prisma.expense.create({
      data: {
        createBy: user.userId,
        name: expense.name,
        amount: expense.amount,
      },
    })

    this.commandController.expenseCreateWithSucess(creatingExpense, sendMessage)
  }

  getAllExpenses = async (
    userId: number,
    sendMessage: (text: string) => void,
  ) => {
    const expenses = await prisma.expense.findMany({
      where: {
        createBy: userId,
      },
    })

    if (!expenses.length) {
      return sendMessage('Você não possui despesa cadastrada.')
    }

    this.commandController.allExpenses(expenses, sendMessage)
  }
}
