import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'storage.json')

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
}

// Initialize the file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}))
}

export function getItem(key: string): any {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  return data[key]
}

export function setItem(key: string, value: any): void {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  data[key] = value
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export function removeItem(key: string): void {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  delete data[key]
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

