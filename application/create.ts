import * as gracely from "gracely"
import * as model from "@userwidgets/model"
import * as http from "cloudly-http"
import { Context } from "../Context"
import { router } from "../router"

export async function create(request: http.Request, context: Context): Promise<http.Response.Like | any> {
	let result: gracely.Error | model.Application
	const application: model.Application.Creatable | any = await request.body
	const admin = gracely.Error.is(context.authenticator)
		? context.authenticator
		: await context.authenticator.authenticate(request, "admin")
	if (gracely.Error.is(context.applications))
		result = context.applications
	else if (!model.Application.Creatable.is(application))
		result = gracely.client.invalidContent("model.Application", "Request body invalid")
	else if (!admin)
		result = gracely.client.unauthorized(
			`Not authorized for this action on userwidgets application. Received '${request.header.authorization}'`
		)
	else
		result = await context.applications.create(application)
	return result
}

router.add("POST", "/application", create)
