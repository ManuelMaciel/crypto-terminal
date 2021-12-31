
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

