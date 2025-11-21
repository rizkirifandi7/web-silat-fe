import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
	role?: string;
	exp?: number;
	[key: string]: unknown;
}

/**
 * Parse JWT token and extract payload
 * Validates token structure and expiry
 * @param token - JWT token string
 * @returns Parsed payload or null if invalid/expired
 */
function parseJwt(token: string): JwtPayload | null {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) {
			return null;
		}

		const base64Url = parts[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map(function (c) {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join("")
		);

		const payload: JwtPayload = JSON.parse(jsonPayload);

		// Check if token is expired
		if (payload.exp) {
			const now = Math.floor(Date.now() / 1000);
			if (payload.exp < now) {
				console.log("Token expired");
				return null;
			}
		}

		return payload;
	} catch (error) {
		console.error("Failed to parse JWT:", error);
		return null;
	}
}

export function middleware(request: NextRequest) {
	const token = request.cookies.get("token");

	// Redirect to login if no token
	if (!token) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Parse and validate token
	const payload = parseJwt(token.value);
	if (!payload || !payload.role) {
		// Token invalid or expired - clear cookie and redirect
		const response = NextResponse.redirect(new URL("/login", request.url));
		response.cookies.delete("token");
		return response;
	}

	// Role-based route protection
	const url = request.nextUrl.pathname;

	// Admin and superadmin only for /dashboard routes
	if (
		url.startsWith("/dashboard") &&
		!url.startsWith("/dashboard-anggota")
	) {
		if (!["admin", "superadmin"].includes(payload.role)) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// Anggota only for /dashboard-anggota routes
	if (url.startsWith("/dashboard-anggota")) {
		if (payload.role !== "anggota") {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/dashboard-anggota/:path*"],
};
