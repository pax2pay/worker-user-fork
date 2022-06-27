import * as gracely from "gracely"
import * as http from "cloudly-http"
import * as model from "../../model"
import { Context } from "../Context"
import { router } from "../router"

export async function fetch(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: model.Organization | gracely.Error
	const key: model.User.Key | any = await context.authenticator.authenticate(request, "token")
	if (gracely.Error.is(context.storage.application))
		result = context.storage.application
	else if (!key)
		result = gracely.client.unauthorized()
	else if (!request.header.application)
		result = gracely.client.missingHeader("Application", "Must include Application for this resource.")
	else if (typeof request.header.application != "string")
		result = gracely.client.malformedHeader("Application", "expected Application value to be a string.")
	else if (key.audience != request.header.application)
		result = gracely.client.unauthorized()
	else
		result = await context.storage.application.fetchOrganization(request.header.application, request.parameter.id)
	return result
}

router.add("GET", "api/organization/:id", fetch)
