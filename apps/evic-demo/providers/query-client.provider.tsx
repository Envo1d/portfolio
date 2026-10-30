"use client"

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PropsWithChildren, useState } from "react"

export function TanstackQueryClientProvider({ children }: PropsWithChildren) {
	const [client] = useState<QueryClient>(
		(): QueryClient => new QueryClient({
			mutationCache: new MutationCache({
				onSuccess: (): void => { void client.invalidateQueries() }
			}),
			defaultOptions: {
				queries: {
					refetchOnWindowFocus: false
				}
			}
		})
	)

	return (
		<QueryClientProvider client={client}>
			{children}
		</QueryClientProvider>
	)
}
