import { expensesFilterByMonth } from '../utils/getAllExpensesMounth'
import { prisma } from '../utils/prisma'

export class UserController {
  wellcome = (
    userId: number,
    username: string | undefined,
    sendMessage: (text: string) => void,
  ) => {
    this.register(userId)
    sendMessage(`Olá ${username}, seja bem-vindo ao devFinances!`)
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
