const fs = require("fs/promises")
const FileService = require("./file.service")

module.exports = {
  async uploadFile(req, res, next) {
    try {
      const { mv, name: fileName, mimetype, size } = req.files.file
      mv("./uploads/" + fileName)
      const [name, extension] = fileName.split('.')
      const result =
        await FileService.insertFile(name, extension, mimetype, size, new Date())
      return res.status(201).json(result)
    } catch (err) {
      next(err)
    }
  },
  async listFiles(req, res, next) {
    try {
      const limit = parseInt(req.query.list_size ?? 10)
      const page = parseInt(req.query.page ?? 1)
      const result = await FileService.getFiles(limit, page)
      return res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  },
  async deleteFile(req, res, next) {
    try {
      const result = await FileService.getFileById(req.params.id)
      await fs.unlink(`./uploads/${result.name}.${result.extension}`)
      await result.destroy()
      return res.status(204).end()
    } catch (err) {
      next(err)
    }
  },
  async getFileInfo(req, res, next) {
    try {
      const result = await FileService.getFileById(req.params.id)
      return res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  },
  async downloadFile(req, res, next) {
    try {
      const file = await FileService.getFileById(req.params.id)
      res.status(200).download(`./uploads/${file.name}.${file.extension}`)
    } catch (err) {
      next(err)
    }
  },
  async updateFileInfo(req, res, next) {
    try {
      const { mv, name: fileName, mimetype, size } = req.files.file
      mv("./uploads/" + fileName)
      const [name, extension] = fileName.split('.')
      const result =
        await FileService.updateFile(req.params.id, name, extension, mimetype, size, new Date())
      return res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  },
}
