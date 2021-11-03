import { Context } from "./Context"
import { Environment } from "./Environment"

import "./me"
import "./user"

export default {
	async fetch(request: Request, environment: Environment) {
		return await Context.handle(request, environment)
	},
}
