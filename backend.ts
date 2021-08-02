import { Client } from "@pax2pay/client"

declare const backendUrl: string | undefined

export const backend = Client.create(backendUrl)
