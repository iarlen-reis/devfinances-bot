import { prisma } from '../utils/prisma'

export class UserController {
  wellcome = (
    userId: string,
    username: string | undefined,
    sendMessage: (text: string) => void,
  ) => {
    this.register(userId)
    sendMessage(`Olá ${username}, seja bem-vindo ao devFinances!`)
  }

  profile = (
    userId: string,
    username: string | undefined,
    sendMessage: (text: string) => void,
  ) => {
    sendMessage(
      `Olá ${username}, esses são seus dados: \nNOME: ${username} \nFINANÇAS MENSAL: 0 \nFINANÇAS TOTAL: 0`,
    )
  }

  register = async (userId: string) => {
    const user = await prisma.user.findFirst({
      where: {
        userId,
      },
    })

    if (user) {
      return user
    }

    await prisma.user.create({
      data: {
        userId,
      },
    })
  }
}