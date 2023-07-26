import { commands } from '../utils/commnands'

export class CommandController {
  allCommands = (sendMessage: (text: string) => void) => {
    sendMessage(
      `${commands
        .map(
          (comand) =>
            `COMANDO: ${comand.command} \nDESCRIÇÃO: ${comand.description}\n`,
        )
        .join('\n')}`,
    )
  }
}
