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

app.post('/signin', Middlewares.checkForIdAndPassword, UserController.signin)
app.post('/signin/new_token', UserController.newToken)
app.post('/signup', Middlewares.checkForIdAndPassword, UserController.signup)
app.get('/info', Middlewares.auth, UserController.info)
app.get('/logout', Middlewares.auth, UserController.logout)

app.post('/file/upload', Middlewares.auth, FileController.uploadFile)
app.get('/file/list', Middlewares.auth, FileController.listFiles)
app.delete('/file/delete/:id', Middlewares.auth, FileController.deleteFile)
app.get('/file/:id', Middlewares.auth, FileController.getFileInfo)
app.get('/file/download/:id', Middlewares.auth, FileController.downloadFile)
app.put('/file/update/:id', Middlewares.auth, FileController.updateFileInfo)

app.use(Middlewares.errorHandler)

app.use(Middlewares.unknownEndpoint)

app.listen(PORT, () => {
	console.log(`App is listening on ${PORT}`)
})
