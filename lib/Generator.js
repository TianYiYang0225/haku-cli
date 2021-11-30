const ora = require('ora')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')

// const inquirer = require('inquirer')
const util = require('util')
const downloadGitReProject = require('download-git-repo')

// 加载动画
async function loading(fn, message, ...args) {
  const spinner = ora(message)
  spinner.start()

  try {
    await fn(...args)
    spinner.succeed('下载成功')
    return true
  } catch (error) {
    console.log('error', error)
    spinner.fail('下载失败', error)
    return false
  }
}

class GeneratorProject {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name
    // 路径
    this.targetDir = targetDir
    // promise化downloadGitReProject
    this.downloadGitReProject = util.promisify(downloadGitReProject)
  }

  async create() {
    const isDownload = await this.download()
    // 下载成功修改package 输出log
    if (isDownload) {
      this.updatePackageFile()
      console.log(`\r\n成功创建项目： ${chalk.cyan(this.name)}`)
      console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
      console.log('  npm run dev\r\n')
    }
  }

  // 下载模板函数
  async download() {
    const templateUrl = 'TianYiYang0225/template-react#main'
    const result = await loading(
      this.downloadGitReProject,
      '正在下载模板中...',
      templateUrl,
      path.resolve(process.cwd(), this.targetDir)
    )
    return result
  }

  updatePackageFile() {
    const fileName = `${this.targetDir}/package.json`
    if (fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName).toString()
      let json = JSON.parse(data)
      json.name = this.name
      //   json.author = answer.author
      //   json.description = answer.description
      //修改项目文件夹中 package.json 文件
      fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8')
    }
  }
}

module.exports = GeneratorProject
