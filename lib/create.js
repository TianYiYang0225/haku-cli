// lib/create.js

const path = require('path')
const fs = require('fs-extra')
const GeneratorProject = require('./Generator')

const inquirer = require('inquirer')

module.exports = async function (name, options) {
  // 当前命令行执行所在的目录
  const cwd = process.cwd()

  // 需要创建的目录路径
  const targetPath = path.join(cwd, name)

  // 检查目录是否存在
  if (fs.existsSync(targetPath)) {
    // 强制覆盖
    if (options.force) {
      await fs.remove(targetPath)
    } else {
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '当前项目已存在，是否覆盖？',
          choices: [
            {
              name: '覆盖',
              value: true
            },
            {
              name: '不覆盖',
              value: false
            }
          ]
        }
      ])

      if (action) {
        await fs.remove(targetPath)
      }
    }
  }

  const generator = new GeneratorProject(name, targetPath)
  generator.create()
}
