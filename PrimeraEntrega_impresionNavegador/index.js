const express = require('express')
const app = express()

let {texto}= require('./principal')

 
app.get('/', function (req, res) {
  res.send(texto)
})
 
app.listen(3000)