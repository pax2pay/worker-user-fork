import * as gracely from "gracely"
import * as model from "@pax2pay/model"
import * as client from "@pax2pay/client"
import { User } from "./User"

export class Auth {
	constructor(private readonly client: client.Client) {}
	async login(user: string, password: string, issuer: model.Key.Issuer): Promise<model.Me | gracely.Error> {
		let result: model.Me | gracely.Error
		const response = await this.client.auth.login({
			username: user,
			password: password,
		})
		if (!response)
			result = gracely.server.backendFailure()
		else {
			if (client.ErrorResponse.is(response))
				result = gracely.server.backendFailure(response)
			else {
				if (response.status != "SUCCESS")
					result = gracely.client.unauthorized(response.issues?.[0].message)
				else {
					result = await Auth.convert(response, issuer)
				}
			}
		}
		return result
	}
	static async convert(login: client.LoginResponse, issuer: model.Key.Issuer): Promise<model.Me> {
		return {
			...User.convert(login.user),
			key: (await issuer.sign({ backend: login.token, expires: login.expiry })) ?? "",
		}
	}
}
