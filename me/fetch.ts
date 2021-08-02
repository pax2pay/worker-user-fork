import * as gracely from "gracely"
import * as isoly from "isoly"
import * as model from "@pax2pay/model"
import { ErrorResponse } from "@pax2pay/client"
import * as http from "cloud-http"
import { backend } from "../backend"
import { router } from "../router"

declare const signingSecret: string

export async function fetch(request: http.Request): Promise<http.Response.Like | any> {
	let result: model.Me | gracely.Error
	const authorization = model.Credentials.fromBasic(request.header.authorization)
	if (!backend)
		result = gracely.server.misconfigured("backendUrl", "Missing configuration of backend system.")
	else if (!authorization)
		result = gracely.client.unauthorized()
	else {
		const response = await backend?.auth.login({
			username: authorization.user,
			password: authorization.password ?? "",
		})
		if (!response)
			result = gracely.server.backendFailure()
		else {
			if (ErrorResponse.is(response))
				result = gracely.server.backendFailure(response)
			else {
				if (response.status != "SUCCESS")
					result = gracely.client.unauthorized(response.issues?.[0].message)
				else if (!signingSecret)
					result = gracely.client.unauthorized()
				else {
					const issuer = model.Key.Issuer.create("test", signingSecret)
					result = {
						user: response.user.username ?? "",
						name: {
							first: response.user.firstName ?? "",
							last: response.user.lastName ?? "",
						},
						email: response.user.email ?? "",
						key: (await issuer.sign({ backend: response.token, expires: response.expiry })) ?? "",
						organization: {
							code: response.user.organisation?.code ?? "",
							name: response.user.organisation?.name ?? "",
							status: (response.user.organisation?.status?.toLowerCase() ?? "active") as "active" | "deleted",
						},
						status: response.user.status?.toLowerCase() as model.User.Status,
						password: { changed: response.user.passwordUpdatedOn ?? "" },
						limits:
							response.user.userLimits?.map<model.User.Limit>(l => ({
								limit: l.limit,
								currency: l.currency as isoly.Currency,
								type: l.setBy.toLowerCase() as "user" | "category",
							})) ?? [],
						"2fa": { enabled: response.user["2fa"]?.enabled, provider: response.user["2fa"]?.provider },
					}
				}
			}
		}
	}

	return await result
}
router.add("GET", "api/me", fetch)
