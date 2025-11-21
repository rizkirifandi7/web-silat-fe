import { useState, useEffect } from "react";
import {
	fetchCampaigns,
	fetchCampaignBySlug,
	fetchPaymentMethods,
} from "@/lib/donasi-api";
import type { Campaign, CampaignDetail, PaymentMethod } from "@/types/donasi";

/**
 * Custom hook for fetching campaigns list
 */
export const useCampaigns = () => {
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadCampaigns = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await fetchCampaigns({
				status: "active",
				is_published: true,
				limit: 10,
			});
			setCampaigns(data);
		} catch (err) {
			console.error("❌ useCampaigns: Error occurred:"  , err);
			setError(err instanceof Error ? err.message : "Failed to load campaigns");
		} finally {
			setLoading(false);
		}
	};  

	useEffect(() => {
		loadCampaigns();
	}, []);

	return { campaigns, loading, error, refetch: loadCampaigns };
};

/**
 * Custom hook for fetching campaign detail by slug
 */
export const useCampaignDetail = (slug: string) => {
	const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadCampaign = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await fetchCampaignBySlug(slug);
			setCampaign(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load campaign detail"
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (slug) {
			loadCampaign();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slug]);

	return { campaign, loading, error, refetch: loadCampaign };
};

/**
 * Custom hook for fetching payment methods
 */
export const usePaymentMethods = () => {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadPaymentMethods = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await fetchPaymentMethods({ is_active: true });
			setPaymentMethods(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load payment methods"
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPaymentMethods();
	}, []);

	return { paymentMethods, loading, error, refetch: loadPaymentMethods };
};
