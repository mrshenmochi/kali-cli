#! /usr/bin/env node

import * as coinp from 'coinp'
import { execSync } from 'node:child_process'

const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g
const netRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(3[0-2]]?|[1-2]?[0-9])$/g

coinp.intro('fping command')

const action = await coinp.list({
  message: 'What action do you want to do?',
  choices: [
    { label: 'Discover net', value: 'net' },
    { label: 'Detect host', value: 'host' },
  ],
})

if (action === 'net') {
  const net = await coinp.text({
    message: 'What network do you want to discover?',
    placeholder: '192.168.1.0/24',
    verify: value => {
      if (!netRegex.test(value)) return 'You must specify a valid network IP'
    },
  })

  const startTime = new Date()

  const netLoader = coinp.loader('Discovering net')
  netLoader.start()

  try {
    execSync(`fping -q -a -g ${net}`)
  } catch (error) {
    const endTime = new Date()

    const diffTime = Math.abs(endTime - startTime)
    const diffSeconds = Math.floor(diffTime / 1000)

    netLoader.end(`Scan completed in ${diffSeconds} second${diffSeconds !== 1 ? 's' : ''}`)

    const hosts = error.stdout.toString().split('\n')
    hosts.pop()

    if (hosts.length === 0) coinp.outro('No hosts detected')
    else coinp.outro(...hosts)
  }
} else {
  const ip = await coinp.text({
    message: 'What IP do you want to detect?',
    placeholder: '192.168.1.10',
    verify: value => {
      if (!ipRegex.test(value)) return 'You must specify a valid IP'
    },
  })

  const startTime = new Date()

  const ipLoader = coinp.loader('Detecting IP')
  ipLoader.start()

  try {
    execSync(`fping ${ip}`).toString()

    const endTime = new Date()

    const diffTime = Math.abs(endTime - startTime)
    const diffSeconds = Math.floor(diffTime / 1000)

    ipLoader.end(`Scan completed in ${diffSeconds} second${diffSeconds !== 1 ? 's' : ''}`)

    coinp.outro(`${ip} is active`)
  } catch (error) {
    const endTime = new Date()

    const diffTime = Math.abs(endTime - startTime)
    const diffSeconds = Math.floor(diffTime / 1000)

    ipLoader.end(`Scan completed in ${diffSeconds} second${diffSeconds !== 1 ? 's' : ''}`)

    coinp.outro(`${ip} isn't active`)
  }
}
