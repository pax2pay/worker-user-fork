import * as gracely from "gracely"
import * as http from "cloud-http"
import { router } from "../router"

export async function list(request: http.Request): Promise<http.Response.Like | any> {
	const result: any[] | gracely.Error = []
	return result
}
router.add("GET", "api/user", list)
