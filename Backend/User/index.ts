import * as gracely from "gracely"
import * as isoly from "isoly"
import * as model from "@pax2pay/model"
import * as client from "@pax2pay/client"
import { Organization } from "../Organization"
import { Limit } from "./Limit"

export class User {
	constructor(private readonly client: client.Client) {}
	async list(): Promise<model.User[] | gracely.Error> {
		const response = await this.client.users.list(0, 1000)
		return client.ErrorResponse.is(response)
			? gracely.server.backendFailure(response)
			: response.map<model.User>(User.convert)
	}
	static convert(u: client.UserResponse): model.User {
		return {
			user: u.username ?? "",
			name: {
				first: u.firstName ?? "",
				last: u.lastName ?? "",
			},
			email: u.email ?? "",
			status: "active",
			password: { changed: isoly.Date.is(u.passwordUpdatedOn) ? u.passwordUpdatedOn : isoly.Date.now() },
			organization: Organization.convert(u.organisation),
			limits: (u.userLimits ?? []).map(Limit.convert),
			"2fa": {
				enabled: u["2fa"]?.enabled,
				provider: u["2fa"]?.provider,
			},
		}
	}
}
