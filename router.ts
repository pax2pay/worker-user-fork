import { FormData } from "cloud-formdata"
import * as http from "cloud-http"
import * as cloudRouter from "cloud-router"

http.Parser.add(
	async request =>
		Object.fromEntries(
			(
				await FormData.parse(
					new Uint8Array(await request.arrayBuffer()),
					request.headers.get("Content-Type") ?? "multipart/form-data"
				)
			).entries()
		),
	"multipart/form-data"
)

export const router = new cloudRouter.Router()
