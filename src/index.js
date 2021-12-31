
const program = require('commander')
const axios = require('axios')
const ora = require('ora')
const Table = require('cli-table3')
const colors = require('colors')
const validation = require('./validation.js')

const DEFAULT_TOP = 10
const MAX_TOP = 2000

// helper functions
const list = value => value && value.split(',') || []

const getColoredChangeValueText = (value) => {
  const text = `${value}%`
  return value && (value > 0 ? text.green : text.red) || 'NA'
}

const formatNumber = n => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
}

const getValidTop = (top) => {
  if (Number.isNaN(top) || top < 1) {
    return DEFAULT_TOP
  }
  if (top > MAX_TOP) {
    return MAX_TOP
  }
  return top
}

const { version } = require('../package.json')
program
  .version(version)
  .option('-f, --search [symbol]', 'Busca los datos de una moneda especifica con su simbolo (puede haber separacion por comas)', list, [])
  .option('-t, --top [index]', 'Muestra el ranked top de las monedas del 1 - [index] segun la capitalizacion del mercado', validation.validateNumber, DEFAULT_TOP)
  .parse(process.argv)

console.log('\n')

const find = program.find
const top = find.length > 0 ? MAX_TOP : getValidTop(program.top)

// handle table
const defaultHeader = [
  'Ranking',
  'Moneda',
  'Precio (USD)',
  'Cambio 24H',
  'Capitalizacion',
  'Suministro',
  'Volumen 24H',
].map(title => title.yellow)
const defaultColumns = defaultHeader.map((item, index) => index)
const columns = defaultColumns
const sortedColumns = columns.sort()
const header = sortedColumns.map(index => defaultHeader[index])
const table = new Table({
  chars: {
    'top': '─',
    'top-mid': '┬',
    'top-left': '┌',
    'top-right': '┐',
    'bottom': '─',
    'bottom-mid': '┴',
    'bottom-left': '└',
    'bottom-right': '┘',
    'left': '│',
    'left-mid': '├',
    'mid': '─',
    'mid-mid': '┼',
    'right': '│',
    'right-mid': '┤',
    'middle': '│'
  },
  head: header
})
