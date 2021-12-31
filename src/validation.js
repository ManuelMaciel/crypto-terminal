module.exports = {
  validateNumber : (value) => {
    if (isNaN(value) && +value >= 0) {
      console.log(`Por favor, introduzca un parámetro válido.`.red)
      process.exit()
    }
    return +value
  }
}
