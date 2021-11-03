import { Client } from "@pax2pay/client"
import { Auth } from "./Auth"
import { User } from "./User"

export class Backend {
	readonly auth: Auth
	readonly user: User
	private constructor(private readonly client: Client) {
		this.auth = new Auth(client)
		this.user = new User(client)
	}
	static create(backendUrl: string | undefined, token?: string) {
		const client = Client.create(backendUrl, token)
		return client && new Backend(client)
	}
}
