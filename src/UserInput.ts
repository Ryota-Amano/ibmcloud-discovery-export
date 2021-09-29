import Readline from 'readline'

export const readUserInput = (question: string): Promise<string> => {
  const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer)
      rl.close()
    })
  })
}