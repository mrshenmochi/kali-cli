#! /usr/bin/env node

import { outro } from 'coinp'
import { loader } from 'coinp'
import { intro } from 'coinp'
import { execSync } from 'node:child_process'

intro('System update')
const startTime = new Date()

const currentUser = execSync('whoami')
  .toString()
  .replace(/(\r\n|\n|\r)/gm, '')

if (currentUser !== 'root') outro('You must be sudo to continue')
else {
  const updateLoader = loader('System update', 'System upgrade')
  updateLoader.start()
  execSync('apt-get update')
  updateLoader.next('System updated')
  execSync('apt-get upgrade -y')
  updateLoader.end('System updated')

  const endTime = new Date()

  const diffTime = Math.abs(endTime - startTime)
  const diffSeconds = Math.floor(diffTime / 1000)

  outro(`Ended update in ${diffSeconds} second${diffSeconds !== 1 ? 's' : ''}`)
}
