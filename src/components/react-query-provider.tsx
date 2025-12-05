/**
 * React Query Provider Component
 * Wraps the app with QueryClientProvider for global data fetching state management
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function ReactQueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // 1 minute
						retry: 1,
						refetchOnWindowFocus: false,
					},
					mutations: {
						retry: 0,
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* DevTools removed for production - install @tanstack/react-query-devtools if needed */}
		</QueryClientProvider>
	);
}
