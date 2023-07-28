import { expensesFilterByMonth } from '../utils/getAllExpensesMounth'
import { prisma } from '../utils/prisma'
import { CommandController } from './commandController'

export class UserController {
  constructor(private commandController: CommandController) {
    this.commandController = commandController
  }

  wellcome = (
    userId: number,
    username: string | undefined,
    sendMessage: (text: string) => void,
  ) => {
    this.register(userId)

    this.commandController.allCommands(username, sendMessage)
  }

  profile = async (
    userId: number,
    username: string | undefined,
    sendMessage: (text: string) => void,
  ) => {
    const expenses = await prisma.expense.findMany({
      where: {
        createBy: userId,
      },
    })

    const { allActualMonthExpenses, allFinances } =
      expensesFilterByMonth(expenses)

    sendMessage(
      `OLÁ ${username?.toUpperCase()}, ESSES SÃO SEUS DADOS: \nFINANÇAS MENSAL ATUAL: ${allActualMonthExpenses} \nFINANÇAS TOTAL: ${allFinances}`,
    )
  }

  register = async (userId: number) => {
    const user = await prisma.user.findFirst({
      where: {
        userId,
      },
    })

    if (user) {
      return user
    }

    const creatingUser = await prisma.user.create({
      data: {
        userId,
      },
    })

    return creatingUser
  }
}
