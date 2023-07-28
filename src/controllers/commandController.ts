import { commands } from '../utils/commnands'

interface IExpenseProps {
  id: string
  name: string
  amount: string
  createdAt: Date
}

export class CommandController {
  allCommands = (
    username: string | undefined,
    sendMessage: (text: string) => void,
  ) => {
    sendMessage(
      `Olá! ${username}, seja bem-vindo ao devFinances!\n \nLISTA DE COMANDOS:\n\n${commands
        .map(
          (comand) =>
            `COMANDO: ${comand.command} \nDESCRIÇÃO: ${comand.description}\n`,
        )
        .join('\n')}`,
    )
  }

  formatExpenseIvalid = (sendMessage: (text: string) => void) => {
    sendMessage(`Envie no seguinte formato:\n/add Uber 19.96`)
  }

  expenseCreateWithSucess = (
    expense: IExpenseProps,
    sendMessage: (text: string) => void,
  ) => {
    sendMessage(
      `Despesa criada com sucesso!\nID: ${expense.id}\nNOME: ${
        expense.name
      }\nVALOR: R$ ${
        expense.amount
      }\nCRIADO EM: ${expense.createdAt.toLocaleDateString()}`,
    )
  }

  allActualMonthExpenses = (
    expenses: IExpenseProps[],
    sendMessage: (text: string) => void,
  ) => {
    sendMessage(
      `ESSES SÃO SUAS DESPESAS DO MÊS ATUAL: \n${expenses
        .map(
          (expense) =>
            `\nID: ${expense.id}\nNOME: ${expense.name}\nVALOR: R$ ${
              expense.amount
            }\nCRIADO EM: ${expense.createdAt.toLocaleDateString()}`,
        )
        .join('\n')}`,
    )
  }

  expenseFoundWithSuccess = (
    expense: IExpenseProps,
    sendMessage: (text: string) => void,
  ) => {
    sendMessage(
      `Despesa selecionada:\nID: ${expense.id}\nNOME: ${
        expense.name
      }\nVALOR: R$ ${
        expense.amount
      }\nCRIADO EM: ${expense.createdAt.toLocaleDateString()}`,
    )
  }
}
