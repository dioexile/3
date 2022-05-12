require('dotenv').config();
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const fileUpload = require('express-fileupload')
const {Chat, Message} = require('./models/models')



const PORT = process.env.PORT || 5000


const app = express()
// app.use((res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-Requested-With, content-type'
//   );
// });
app.use(express.json({ extended: true }))
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(fileUpload({}))
// app.use(cors())
app.use('/api', router)

// Обработка ошибок, последний Middleware
app.use(errorHandler)

const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
})

async function start(){
  try {

    await sequelize.authenticate()
    await sequelize.sync()
    httpServer.listen(PORT, () => console.log(`app started on PORT ${PORT}...`))

  } catch (error) {

    console.log(error.message)
    process.exit(1)

  }
}
const { offer, send } = require("./socket/chatController")(io)
const onConnection = (socket) => {

  socket.on("offer", offer)
  socket.on("send", send)

}
io.on("connection", onConnection)



start()