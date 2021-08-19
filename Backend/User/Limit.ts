import * as isoly from "isoly"
import * as model from "@pax2pay/model"
import * as client from "@pax2pay/client"

export class Limit {
	constructor(private readonly client: client.Client) {}
	static convert(limit: client.UserLimit): model.User.Limit {
		const currency = limit?.currency
		return {
			currency: isoly.Currency.is(currency) ? currency : "XXX",
			limit: limit?.limit ?? 0,
			type: limit?.setBy == "CATEGORY" ? "category" : "user",
		}
	}
}
