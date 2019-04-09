#!/usr/bin/env node
import 'perish'

import meow from 'meow'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import { getNpmStats } from './'

const cli = meow(`
  Usage
    $ get-npm-stats <packages>

  Options
    --output, -o  Directory to output images, defaults to CWD

  Examples
    $ get-npm-stats -o ./images yarn npm
`, {
  flags: {
    output: {
      alias: 'o',
      type: 'string'
    }
  }
})

const main = async () => {
  let outDir = process.cwd()

  if (cli.flags.output) {
    outDir = path.isAbsolute(cli.flags.output) ? cli.flags.output : outDir = path.resolve(outDir, cli.flags.output)

    const [stats] = await Promise.all([
      promisify(fs.stat)(outDir),
      // Will throw if dir doesn't satisfy `mode`
      promisify(fs.access)(outDir, fs.constants.R_OK | fs.constants.W_OK)
    ])

    if (!stats.isDirectory()) {
      throw new Error(`${outDir} is not a directory`)
    }
  }

  if (!cli.input.length) {
    throw new Error('No packages')
  }

  getNpmStats({ outDir, packages: cli.input })
}

main()