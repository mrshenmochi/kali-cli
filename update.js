#! /usr/bin/env node

import { execSync } from 'node:child_process'

const currentUser = execSync('whoami').toString()
const sudo = currentUser === 'root' ? '' : 'sudo'

console.time('Update duration')
execSync(`${sudo} apt-get update && ${sudo} apt-get upgrade -y`)
console.timeEnd('Update duration')
