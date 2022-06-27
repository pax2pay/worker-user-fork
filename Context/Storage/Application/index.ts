import * as cryptly from "cryptly"
import * as gracely from "gracely"
import * as model from "../../../../model"
import * as common from "../../../common"

export class Application {
	private constructor(private readonly applicationNamespace: DurableObjectNamespace) {}
	async fetch(id: string): Promise<model.Application | gracely.Error> {
		return await common.DurableObject.Client.open(this.applicationNamespace, id).get<model.Application>(`application`)
	}

	async create(application: model.Application.Creatable): Promise<model.Application | gracely.Error> {
		const id = cryptly.Identifier.generate(4)
		return await common.DurableObject.Client.open(this.applicationNamespace, id).post<model.Application>(
			"application",
			{ ...application, id: id }
		)
	}

	async seed(application: model.Application): Promise<model.Application | gracely.Error> {
		return await common.DurableObject.Client.open(this.applicationNamespace, application.id).post<model.Application>(
			"application/seed",
			application
		)
	}

	async fetchOrganization(applicationId: string, organizationId: string): Promise<model.Organization | gracely.Error> {
		return await common.DurableObject.Client.open(this.applicationNamespace, applicationId).get<model.Organization>(
			`organization/${organizationId}`
		)
	}

	async createOrganization(
		applicationId: string,
		organization: model.Organization.Creatable
	): Promise<model.Organization | gracely.Error> {
		return common.DurableObject.Client.open(this.applicationNamespace, applicationId).post<model.Organization>(
			"organization",
			organization
		)
	}

	async listOrganizations(
		applicationId: string,
		organizationIds: string[]
	): Promise<model.Organization[] | gracely.Error> {
		const response = await common.DurableObject.Client.open(this.applicationNamespace, applicationId).get<
			model.Organization[]
		>(`organization`)
		return gracely.Error.is(response)
			? response
			: response.filter(organization => organizationIds.includes(organization.id))
	}

	static open(applicationNamespace?: DurableObjectNamespace): Application | gracely.Error {
		return !applicationNamespace
			? gracely.server.misconfigured("applicationNamespace", "Storage namespace missing.")
			: applicationNamespace && new this(applicationNamespace)
	}
}
