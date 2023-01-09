
module.exports = {
	async auth(req, res, next) {

	},

	errorHandler(err, req, res, next) {
		console.log(err)
		res.json({ error: err.name })
	},

	unknownEndpoint(req, res) {
		res.status(404).json({ msg: "unkown endpoint" })
	}
}
