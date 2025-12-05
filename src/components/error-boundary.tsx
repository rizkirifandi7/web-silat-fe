/**
 * Error Boundary Component
 * Catches runtime errors and displays fallback UI
 */

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log error to error reporting service (e.g., Sentry)
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	private handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	public render() {
		if (this.state.hasError) {
			// Custom fallback UI if provided
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Default fallback UI
			return (
				<div className="flex items-center justify-center min-h-[400px] p-4">
					<Card className="w-full max-w-md">
						<CardHeader>
							<div className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-destructive" />
								<CardTitle>Terjadi Kesalahan</CardTitle>
							</div>
							<CardDescription>
								Maaf, terjadi kesalahan saat memuat halaman ini.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{process.env.NODE_ENV === "development" && this.state.error && (
								<div className="rounded-md bg-muted p-3">
									<p className="text-sm font-mono text-muted-foreground break-all">
										{this.state.error.message}
									</p>
								</div>
							)}
							<div className="flex gap-2">
								<Button onClick={this.handleReset} className="flex-1">
									<RefreshCw className="mr-2 h-4 w-4" />
									Coba Lagi
								</Button>
								<Button
									variant="outline"
									onClick={() => (window.location.href = "/")}
									className="flex-1"
								>
									Kembali ke Beranda
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
