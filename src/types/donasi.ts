// Donation Types based on API documentation

export interface Campaign {
	id: number;
	title: string;
	slug: string;
	description: string;
	full_description?: string;
	image_url: string;
	target_amount: string;
	collected_amount: string;
	progress_percentage: string;
	total_supporters: number;
	days_remaining?: number;
	status?: string;
	is_published?: boolean;
	organizer_name?: string;
	organizer_image_url?: string;
	organizer_description?: string;
	created_at?: string;
	updated_at?: string;
}

export interface CampaignBenefit {
	id?: number;
	benefit_text: string;
	sort_order: number;
}

export interface CampaignGallery {
	id?: number;
	image_url: string;
	caption?: string;
}

export interface DonationItem {
	id?: number;
	donor_name: string;
	donation_amount: string;
	donor_message?: string;
	is_anonymous?: boolean;
	created_at: string;
}

export interface CampaignDetail extends Campaign {
	benefits: CampaignBenefit[];
	donations: DonationItem[];
	gallery: CampaignGallery[];
}

export interface PaymentMethod {
	id: number;
	name: string;
	channel: string;
	icon_url?: string;
	description?: string;
	admin_fee_type: "fixed" | "percentage";
	admin_fee_value: string;
	is_active?: boolean;
}

export interface CreateDonationPayload {
	campaign_id: number;
	donor_name: string;
	donor_email: string;
	donor_phone?: string;
	donor_message?: string;
	donation_amount: number;
	payment_method_id: number;
	is_anonymous?: boolean;
}

export interface CreateDonationResponse {
	donation_id: number;
	transaction_id: string;
	snap_token: string;
	redirect_url: string;
	total_amount: string;
}

export interface DonationStatus {
	id: number;
	transaction_id: string;
	donor_name: string;
	donor_email: string;
	donation_amount: string;
	admin_fee: string;
	total_amount: string;
	payment_status: string;
	payment_method: string;
	payment_date?: string;
	va_numbers?: Array<{
		bank: string;
		va_number: string;
	}>;
	bill_key?: string;
	biller_code?: string;
	payment_code?: string;
	qr_code_url?: string;
	deeplink_redirect?: string;
	payment_instructions?: string;
	expiry_time?: string;
	campaign: {
		id: number;
		title: string;
		slug: string;
	};
}

export interface CheckDonationStatusResponse {
	status: string;
	data: {
		donation: DonationStatus;
	};
}
