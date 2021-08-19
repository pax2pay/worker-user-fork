import * as model from "@pax2pay/model"
import * as client from "@pax2pay/client"

export class Organization {
	constructor(private readonly client: client.Client) {}
	static convert(organization: client.OrganisationResponse | undefined): model.Organization {
		return {
			code: organization?.code ?? "none",
			name: organization?.name ?? "unnamed",
			status: organization?.status == "ACTIVE" ? "active" : organization?.status == "DELETED" ? "deleted" : "active",
		}
	}
}
