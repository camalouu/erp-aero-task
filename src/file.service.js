const { File } = require("./db")

module.exports = {
	async insertFile(name, extension, mimeType, size, date) {
		return await File.create({
			name, extension, mimeType, size, date
		})
	},
	async getFiles(limit, page) {
		return await File.findAll({
			limit,
			offset: (page - 1) * limit
		})
	},
	async getFileById(id) {
		return await File.findOne({
			where: { id }
		})
	},
	async updateFile(id, name, extension, mimeType, size, date) {
		return await File.update(
			{ name, extension, mimeType, size, date },
			{ where: { id } }
		)
	}
}
