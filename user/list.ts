import * as gracely from "gracely"
import * as model from "@pax2pay/model"
import * as http from "cloud-http"
import { Backend } from "../Backend"
import { router } from "../router"

export async function list(request: http.Request): Promise<http.Response.Like | any> {
	let result: model.User[] | gracely.Error
	const key = await model.Key.Verifier.create("test").authenticate(request.header.authorization)
	const backend = Backend.create(key?.backend)
	if (!backend)
		result = gracely.server.misconfigured("backendUrl", "Missing configuration of backend system.")
	else if (!key)
		result = gracely.client.unauthorized()
	else
		result = await backend.user.list()
	return result
}
router.add("GET", "api/user", list)
