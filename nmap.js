#! /usr/bin/env node

import * as coinp from 'coinp'
import * as tablifier from 'tablifier'
import { execSync } from 'node:child_process'

const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g
const nmapRegex = /\d+\/\w+\s+\w+\s+\w+/g
const urlRegex = /^(https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/g

coinp.intro('nmap command')

const action = await coinp.select({
  message: 'What action do you want to do?',
  choices: [
    { label: 'Fast scan', value: 'fast' },
    { label: 'Full scan (not recommended)', value: 'all' },
  ],
})

const currentIp = execSync("ip -4 addr show eth0 | grep -oP '(?<=inet\\s)\\d+(\\.\\d+){3}'")
  .toString()
  .replace(/(\r\n|\n|\r)/gm, '')

const ip = await coinp.text({
  message: 'What IP do you want to scan?',
  placeholder: `${currentIp}`,
  verify: value => {
    if (!ipRegex.test(value) && !urlRegex.test(value)) return 'You must specify a valid IP or URL address'
  },
})

const table = new tablifier.Table('Port', 'State', 'Service')

if (action === 'fast') {
  const load = coinp.loader('Scanning host')
  const startTime = new Date()

  load.start()
  const result = execSync(`nmap ${ip}`).toString().match(nmapRegex)

  const endTime = new Date()

  const diffTime = Math.abs(endTime - startTime)
  const diffSeconds = Math.floor(diffTime / 1000)

  load.end(`Host scanned in ${diffSeconds} second${diffSeconds !== 1 ? 's' : ''}`)
  coinp.info(`Command executed: nmap ${ip}`)

  if (!result) {
    coinp.outro('No port open')
  } else {
    result.forEach(res => {
      table.addRow(...res.split(/\s+/g))
    })

    coinp.outro(...table.toString().split('\n'))
  }
} else if (action === 'all') {
  const load = coinp.loader('Scanning host')
  const startTime = new Date()

  load.start()
  const result = execSync(`nmap -p- ${ip}`).toString().match(nmapRegex)

  const endTime = new Date()

  const diffTime = Math.abs(endTime - startTime)
  const diffSeconds = Math.floor(diffTime / 1000)

  load.end(`Host scanned in ${diffSeconds} second${diffSeconds !== 1 ? 's' : ''}`)
  coinp.info(`Command executed: nmap -p- ${ip}`)

  if (!result) {
    coinp.outro('No port open')
  } else {
    result.forEach(res => {
      table.addRow(...res.split(/\s+/g))
    })

    coinp.outro(...table.toString().split('\n'))
  }
}
