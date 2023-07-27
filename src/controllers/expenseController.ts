import { prisma } from '../utils/prisma'
import { CommandController } from './commandController'
import { UserController } from './userController'

interface IExpenseProps {
  name: string
  amount: string
}

interface IMethodProps {
  userId: number
  username?: string
  expenseId?: string
  expense?: IExpenseProps
  sendMessage: (text: string) => void
}

export class ExpenseController {
  userController: UserController
  commandController: CommandController

  constructor() {
    this.userController = new UserController()
    this.commandController = new CommandController()
  }

  create = async ({ userId, expense, sendMessage }: IMethodProps) => {
    if (!expense) return

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

  getAllExpenses = async ({ userId, sendMessage }: IMethodProps) => {
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

  getExpense = async ({ userId, expenseId, sendMessage }: IMethodProps) => {
    const expense = await prisma.expense.findUnique({
      where: {
        id: expenseId,
        createBy: userId,
      },
    })

    if (!expense) {
      return sendMessage('Essa despesa não existe.')
    }

    this.commandController.expenseFoundWithSuccess(expense, sendMessage)
  }

  deleteExpense = async ({ userId, expenseId, sendMessage }: IMethodProps) => {
    const expense = await prisma.expense.findUnique({
      where: {
        id: expenseId,
        createBy: userId,
      },
    })

    if (!expense) {
      return sendMessage('Despesa não encontrada.')
    }

    await prisma.expense.delete({
      where: {
        id: expense.id,
      },
    })

    sendMessage('Despesa excluida com sucesso!')
  }
}
