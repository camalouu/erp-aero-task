const express = require("express")
const FileController = require("./src/file.controller")
const UserController = require("./src/user.controller")
const Middlewares = require("./src/middlewares")
const fileUpload = require("express-fileupload")
const { PORT } = require("./config")
const app = express()

app.use(fileUpload({
	createParentPath: true
}))

app.use(express.json())

app.post('/signin', UserController.signin)
app.post('/signin/new_token', UserController.newToken)
app.post('/signup', UserController.signup)
app.get('/info', UserController.info)
app.get('/logout', UserController.logout)

app.post('/file/upload', FileController.uploadFile)
app.get('/file/list', FileController.listFiles)
app.delete('/file/delete/:id', FileController.deleteFile)
app.get('/file/:id', FileController.getFileInfo)
app.get('/file/download/:id', FileController.downloadFile)
app.put('/file/update/:id', FileController.updateFileInfo)

app.use(Middlewares.errorHandler)

app.use(Middlewares.unknownEndpoint)

app.listen(PORT, () => {
	console.log(`App is listening on ${PORT}`)
})
