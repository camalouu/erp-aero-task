const { ACCESS_SECRET } = require("../config")
const jwt = require("jsonwebtoken")

module.exports = {
	checkForIdAndPassword(req, res, next) {
		const { id, password } = req.body
		if (!(id && password))
			return res
				.status(400)
				.json({ success: false, message: "Id and password required" })
		return next()
	},

	async auth(req, res, next) {
		let token = req.get("authorization")
		if (!token) {
			return res.status(403).json({ error: "A token is required for authentication" });
		}
		token = token.split(" ")[1]
		try {
			const decoded = jwt.verify(token, ACCESS_SECRET);
			req.user = decoded;
		} catch (err) {
			console.log(err)
			return res.status(401).json({ error: "Invalid Token" });
		}
		return next();
	},

	errorHandler(err, req, res, next) {
		console.log(err)
		return res
			.status(500)
			.json({
				error: true,
				message: err.name
			})
	},

	unknownEndpoint(req, res) {
		return res
			.status(404)
			.json({ message: "unknown endpoint" })
	}
}
