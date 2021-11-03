import * as gracely from "gracely"
import * as model from "@pax2pay/model"
import * as http from "cloud-http"
import { Backend } from "../Backend"
import { Context } from "../Context"
import { router } from "../router"

export async function fetch(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: model.Me | gracely.Error
	const authorization = model.Credentials.fromBasic(request.header.authorization)
	const issuer = context.environment.signingSecret && model.Key.Issuer.create("test", context.environment.signingSecret)
	const backend = Backend.create(context.environment.backendUrl)
	if (!backend)
		result = gracely.server.misconfigured("backendUrl", "Missing configuration of backend system.")
	else if (!authorization)
		result = gracely.client.unauthorized()
	else if (!issuer)
		result = gracely.server.misconfigured("signingSecret", "Missing signingSecret from environment.")
	else
		result = await backend.auth.login(authorization.user, authorization.password ?? "", issuer)
	return result
}
router.add("GET", "me", fetch)
