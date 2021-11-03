export interface Environment extends Record<string, any> {
	backendUrl?: string
	signingSecret?: string
}
