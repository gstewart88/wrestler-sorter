// scripts/update-events.js
const fs = require('fs')
const path = require('path')

async function main() {
  // 1. Fetch your upstream events JSON
  const res = await fetch('https://example.com/path/to/events.json')
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status}`)
  }
  const events = await res.json()

  // 2. Write it into your repo’s data file
  const outFile = path.resolve(__dirname, '../src/data/events.json')
  fs.writeFileSync(outFile, JSON.stringify(events, null, 2) + '\n')
  console.log('✅ events.json updated')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
