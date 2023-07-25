import { prisma } from '../utils/prisma'

export class UserController {
  wellcome = (
    username: string | undefined,
    sendMessage: (text: string) => void,
  ) => {
    sendMessage(`Olá ${username}, seja bem-vindo ao devFinances!`)
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
