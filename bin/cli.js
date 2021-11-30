#! /usr/bin/env node

// const inquirer = require('inquirer')
const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')

const path = require('path')

const consoleColors = {}
const COLORS = ['green', 'blue', 'yellow', 'red']

COLORS.forEach((color) => {
  consoleColors[color] = (text, isConsole = true) => {
    return isConsole ? console.log(chalk[color](text)) : chalk[color](text)
  }
})

// #! 符号的名称叫 Shebang，用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的文件头
// 如果是Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改

program
  .command('create <project-name>')
  .description('创建一个新的项目')
  .option('-f, --force', '覆盖同名文件夹')
  .action((name, options) => {
    const libUrl = path.join(__dirname, '..', 'lib', 'create.js')
    require(libUrl)(name, options)
  })

program.on('--help', () => {
  // 使用 figlet 绘制 Logo
  console.log(
    '\r\n' +
      figlet.textSync('haku', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
      })
  )
  console.log(
    `\r\n执行 ${chalk.cyan(
      `haku <command> --help`
    )} 可查看更加详细命令 eg:haku config --help\r\n`
  )
})

program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from option')
  .option('-s, --set <path> <value>')
  .option('-d, --delete <path>', 'delete option from config')
// .usage('<command> [option]')

program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
// .action((option) => {
//   console.log('option', option)
// })
// .usage('<command> [option]')

program
  // 配置版本号信息
  .version(
    `v${require('../package.json').version}`,
    '-v, --version',
    '查看当前cli版本'
  )
  .usage('<command> [option]')

program.parse(process.argv)
