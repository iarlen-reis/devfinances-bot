import { prisma } from '../utils/prisma'
import { getFirstAndLastDayMonth } from '../utils/getFirstAndLastDayOfMonth'
import { CommandController } from './commandController'
import { UserController } from './userController'

interface IMethodProps {
  userId: number
  username?: string
  expenseId?: string
  match?: RegExpExecArray | null
  sendMessage: (text: string) => void
}

export class ExpenseController {
  constructor(
    private userController: UserController,
    private commandController: CommandController,
  ) {
    this.userController = userController
    this.commandController = commandController
  }

  create = async ({ userId, match, sendMessage }: IMethodProps) => {
    if (!match) {
      return sendMessage('Por favor, envie no formato /add Uber 19.50')
    }

    const [name, amount] = match[1].split(' ')

    if (!name || !amount) {
      return sendMessage('Por favor, envie no formato /add Uber 19.50')
    }

    const user = await this.userController.register(userId)

    const creatingExpense = await prisma.expense.create({
      data: {
        createBy: user.userId,
        name,
        amount,
      },
    })

    this.commandController.expenseCreateWithSucess(creatingExpense, sendMessage)
  }

  getAllActualMonthExpenses = async ({ userId, sendMessage }: IMethodProps) => {
    const { firstDayOfMonth, lastDayOfMonth } = getFirstAndLastDayMonth()

    const expenses = await prisma.expense.findMany({
      where: {
        createBy: userId,
        createdAt: {
          gte: firstDayOfMonth,
          lt: lastDayOfMonth,
        },
      },
    })

    if (!expenses.length) {
      return sendMessage('Você não possui despesa cadastrada esse mês.')
    }

    this.commandController.allActualMonthExpenses(expenses, sendMessage)
  }

  getExpense = async ({ userId, match, sendMessage }: IMethodProps) => {
    if (!match) {
      return sendMessage('Por favor, envie no formato /add Uber 19.50')
    }

    const expenseId = match[1]

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

  deleteExpense = async ({ userId, match, sendMessage }: IMethodProps) => {
    if (!match) {
      return sendMessage('Por favor, envie no formato /add Uber 19.50')
    }

    const expenseId = match[1]

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
