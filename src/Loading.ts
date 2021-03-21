import rl from 'readline'

const spin_char = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

let spin_count = 0;
const spin = (message: string) => {
  process.stdout.write('\x1B[?25l') //カーソルを消す
  rl.clearLine(process.stdout, 0) //行をすべて削除
  rl.moveCursor(process.stdout, -9999, 0) //一番左側に戻る
  process.stdout.write(`${spin_char[spin_count]} ${message}`) //spin_charの配列で描画
  spin_count++ //要素番号計算
  spin_count >= spin_char.length ? spin_count = 0 : null //要素番号のリセット
}

export const loading = (msg: string) => setInterval(() => {
  spin(msg);
}, 200);

export const endloading = (loading: NodeJS.Timeout, msg: string) => {
  clearInterval(loading)
  rl.clearLine(process.stdout, 0) // 行をすべて削除
  process.stdout.write(`\n${msg}`)//end Message
  process.stderr.write('\x1B[?25h') //ローディングで消したカーソルを戻す
}