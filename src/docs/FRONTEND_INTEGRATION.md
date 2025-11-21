# 🚀 API DONASI - INTEGRASI FRONTEND

## 📋 OVERVIEW

API Donasi memungkinkan user untuk berdonasi ke campaign dengan integrasi pembayaran Midtrans.

**Base URL:** `http://localhost:8015/donasi`

---

## 🎯 FITUR UTAMA

1. **Browse Campaigns** - List dan detail campaign donasi
2. **Create Donation** - Submit donasi dan dapat payment link
3. **Payment Methods** - Get list metode pembayaran
4. **Check Status** - Cek status pembayaran donasi
5. **Webhook** - Otomatis update status dari Midtrans

---

## 📡 ENDPOINTS

### 1. **GET /campaigns** - List Campaign Aktif

**URL:** `GET /donasi/campaigns`

**Query Parameters:**
```javascript
{
  status: "active",           // Filter: active, completed, draft
  is_published: true,         // Filter published only
  limit: 10,                  // Limit hasil
  page: 1,                    // Pagination
  search: "pencak"            // Search by title/description
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "campaigns": [
      {
        "id": 1,
        "title": "Bantu Pembangunan Gedung Latihan",
        "slug": "bantu-pembangunan-gedung-latihan",
        "description": "Mari bersama membangun...",
        "image_url": "https://res.cloudinary.com/...",
        "target_amount": "500000000.00",
        "collected_amount": "125000000.00",
        "progress_percentage": "25.00",
        "total_supporters": 150,
        "days_remaining": 227,
        "status": "active",
        "is_published": true,
        "start_date": "2025-01-01",
        "end_date": "2025-12-31"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

**Frontend Implementation:**
```javascript
// React/Next.js
const fetchCampaigns = async () => {
  const response = await fetch(
    'http://localhost:8015/donasi/campaigns?status=active&is_published=true'
  );
  const result = await response.json();
  setCampaigns(result.data.campaigns);
};

// Display
<div className="campaigns-grid">
  {campaigns.map(campaign => (
    <div key={campaign.id} className="campaign-card">
      <img src={campaign.image_url} alt={campaign.title} />
      <h3>{campaign.title}</h3>
      <p>{campaign.description}</p>
      
      {/* Progress Bar */}
      <div className="progress-bar">
        <div style={{ width: `${campaign.progress_percentage}%` }} />
      </div>
      
      <div className="stats">
        <span>Rp {parseInt(campaign.collected_amount).toLocaleString('id-ID')}</span>
        <span>dari Rp {parseInt(campaign.target_amount).toLocaleString('id-ID')}</span>
      </div>
      
      <p>{campaign.total_supporters} Donatur</p>
      <p>{campaign.days_remaining} hari lagi</p>
      
      <a href={`/campaign/${campaign.slug}`}>
        <button>Donasi Sekarang</button>
      </a>
    </div>
  ))}
</div>
```

---

### 2. **GET /campaigns/:slug** - Detail Campaign

**URL:** `GET /donasi/campaigns/bantu-pembangunan-gedung-latihan`

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Bantu Pembangunan Gedung Latihan",
    "slug": "bantu-pembangunan-gedung-latihan",
    "description": "Deskripsi singkat...",
    "full_description": "<p>Deskripsi lengkap HTML...</p>",
    "image_url": "https://...",
    "target_amount": "500000000.00",
    "collected_amount": "125000000.00",
    "progress_percentage": "25.00",
    "total_supporters": 150,
    "days_remaining": 227,
    "organizer_name": "Padepokan Pencak Silat",
    "organizer_image_url": "https://...",
    "organizer_description": "...",
    "benefits": [
      {
        "id": 1,
        "benefit_text": "Membangun fasilitas latihan",
        "sort_order": 1
      }
    ],
    "donations": [
      {
        "id": 1,
        "donor_name": "Hamba Allah",
        "donation_amount": "100000.00",
        "donor_message": "Semangat!",
        "is_anonymous": false,
        "created_at": "2025-11-15T10:00:00.000Z"
      }
    ],
    "gallery": [
      {
        "id": 1,
        "image_url": "https://...",
        "caption": "Lokasi pembangunan"
      }
    ]
  }
}
```

**Frontend Implementation:**
```javascript
const CampaignDetail = ({ slug }) => {
  const [campaign, setCampaign] = useState(null);
  
  useEffect(() => {
    fetch(`http://localhost:8015/donasi/campaigns/${slug}`)
      .then(res => res.json())
      .then(result => setCampaign(result.data));
  }, [slug]);
  
  if (!campaign) return <Loading />;
  
  return (
    <div className="campaign-detail">
      <img src={campaign.image_url} alt={campaign.title} />
      <h1>{campaign.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: campaign.full_description }} />
      
      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-bar" style={{ width: `${campaign.progress_percentage}%` }} />
        <p>Rp {parseInt(campaign.collected_amount).toLocaleString('id-ID')}</p>
        <p>dari Rp {parseInt(campaign.target_amount).toLocaleString('id-ID')}</p>
        <p>{campaign.total_supporters} Donatur</p>
        <p>{campaign.days_remaining} hari lagi</p>
      </div>
      
      {/* Benefits */}
      <h3>Manfaat Donasi</h3>
      <ul>
        {campaign.benefits.map(benefit => (
          <li key={benefit.id}>{benefit.benefit_text}</li>
        ))}
      </ul>
      
      {/* Organizer */}
      <div className="organizer">
        <img src={campaign.organizer_image_url} />
        <h4>{campaign.organizer_name}</h4>
        <p>{campaign.organizer_description}</p>
      </div>
      
      {/* Recent Donations */}
      <h3>Donatur Terbaru</h3>
      {campaign.donations.map(donation => (
        <div key={donation.id} className="donation-item">
          <p><strong>{donation.donor_name}</strong></p>
          <p>Rp {parseInt(donation.donation_amount).toLocaleString('id-ID')}</p>
          <p>{donation.donor_message}</p>
          <p>{new Date(donation.created_at).toLocaleDateString('id-ID')}</p>
        </div>
      ))}
      
      <button onClick={() => setShowDonationModal(true)}>
        DONASI SEKARANG
      </button>
    </div>
  );
};
```

---

### 3. **GET /payment-methods** - List Metode Pembayaran

**URL:** `GET /donasi/payment-methods?is_active=true`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "BCA Virtual Account",
      "channel": "bank_transfer",
      "midtrans_code": "bca_va",
      "icon_url": "https://...",
      "description": "Transfer via Virtual Account BCA",
      "admin_fee_type": "fixed",
      "admin_fee_value": "4000.00",
      "is_active": true,
      "sort_order": 1
    },
    {
      "id": 6,
      "name": "GoPay",
      "channel": "ewallet",
      "midtrans_code": "gopay",
      "icon_url": "https://...",
      "description": "Bayar dengan GoPay",
      "admin_fee_type": "percentage",
      "admin_fee_value": "2.00",
      "is_active": true,
      "sort_order": 10
    }
  ]
}
```

**Frontend Implementation:**
```javascript
const DonationForm = ({ campaignId }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState(0);
  const [adminFee, setAdminFee] = useState(0);
  
  // Load payment methods
  useEffect(() => {
    fetch('http://localhost:8015/donasi/payment-methods?is_active=true')
      .then(res => res.json())
      .then(result => setPaymentMethods(result.data));
  }, []);
  
  // Calculate admin fee
  const calculateFee = (amount, method) => {
    if (!method) return 0;
    
    if (method.admin_fee_type === 'percentage') {
      return amount * (parseFloat(method.admin_fee_value) / 100);
    }
    return parseFloat(method.admin_fee_value);
  };
  
  useEffect(() => {
    if (selectedMethod && amount > 0) {
      const fee = calculateFee(amount, selectedMethod);
      setAdminFee(fee);
    }
  }, [amount, selectedMethod]);
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        placeholder="Jumlah Donasi"
        min="10000"
      />
      
      {/* Quick Amount Buttons */}
      <div className="quick-amounts">
        <button type="button" onClick={() => setAmount(50000)}>50rb</button>
        <button type="button" onClick={() => setAmount(100000)}>100rb</button>
        <button type="button" onClick={() => setAmount(500000)}>500rb</button>
      </div>
      
      {/* Payment Methods */}
      <select onChange={(e) => {
        const method = paymentMethods.find(m => m.id === parseInt(e.target.value));
        setSelectedMethod(method);
      }}>
        <option value="">Pilih Metode Pembayaran</option>
        {paymentMethods.map(method => (
          <option key={method.id} value={method.id}>
            {method.name} - {method.description}
          </option>
        ))}
      </select>
      
      {/* Fee Preview */}
      {selectedMethod && amount > 0 && (
        <div className="fee-preview">
          <p>Donasi: Rp {amount.toLocaleString('id-ID')}</p>
          <p>Biaya Admin: Rp {Math.round(adminFee).toLocaleString('id-ID')}</p>
          <p><strong>Total: Rp {Math.round(amount + adminFee).toLocaleString('id-ID')}</strong></p>
        </div>
      )}
      
      <button type="submit">LANJUT KE PEMBAYARAN</button>
    </form>
  );
};
```

---

### 4. **POST /donations** - Create Donation

**URL:** `POST /donasi/donations`

**Request Body:**
```json
{
  "campaign_id": 1,
  "donor_name": "Budi Santoso",
  "donor_email": "budi@example.com",
  "donor_phone": "08123456789",
  "donor_message": "Semoga bermanfaat",
  "donation_amount": 100000,
  "payment_method_id": 1,
  "is_anonymous": false
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Donation created successfully",
  "data": {
    "donation_id": 123,
    "transaction_id": "DONATE-1-1700123456789-abc123",
    "snap_token": "66e4fa55-fdac-4ef9-91b5-733b97d1b862",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/...",
    "total_amount": "104000.00"
  }
}
```

**⚠️ PENTING - Load Midtrans Snap.js:**
```html
<!-- Add di <head> -->
<script 
  src="https://app.sandbox.midtrans.com/snap/snap.js" 
  data-client-key="SB-Mid-client-YOUR_CLIENT_KEY">
</script>
```

**Frontend Implementation:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Memproses...';
  
  const donationData = {
    campaign_id: campaignId,
    donor_name: formData.donor_name,
    donor_email: formData.donor_email,
    donor_phone: formData.donor_phone,
    donor_message: formData.donor_message,
    donation_amount: amount,
    payment_method_id: selectedMethod.id,
    is_anonymous: formData.is_anonymous || false
  };
  
  try {
    const response = await fetch('http://localhost:8015/donasi/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData)
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      // Open Midtrans payment popup
      window.snap.pay(result.data.snap_token, {
        onSuccess: function(result) {
          // Payment berhasil
          window.location.href = `/donation/success?transaction_id=${result.order_id}`;
        },
        onPending: function(result) {
          // Payment pending
          window.location.href = `/donation/pending?transaction_id=${result.order_id}`;
        },
        onError: function(result) {
          // Payment error
          alert('Pembayaran gagal! Silakan coba lagi.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'LANJUT KE PEMBAYARAN';
        },
        onClose: function() {
          // User closed popup
          submitBtn.disabled = false;
          submitBtn.textContent = 'LANJUT KE PEMBAYARAN';
        }
      });
    } else {
      alert('Error: ' + result.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'LANJUT KE PEMBAYARAN';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan. Silakan coba lagi.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'LANJUT KE PEMBAYARAN';
  }
};
```

---

### 5. **GET /donations/check/:transaction_id** - Check Status

**URL:** `GET /donasi/donations/check/DONATE-1-1700123456789-abc123`

**Response:**
```json
{
  "status": "success",
  "data": {
    "donation": {
      "id": 123,
      "transaction_id": "DONATE-1-1700123456789-abc123",
      "donor_name": "Budi Santoso",
      "donor_email": "budi@example.com",
      "donation_amount": "100000.00",
      "admin_fee": "4000.00",
      "total_amount": "104000.00",
      "payment_status": "settlement",
      "payment_method": "BCA Virtual Account",
      "payment_channel": "bank_transfer",
      "payment_date": "2025-11-19T10:30:00.000Z",
      "created_at": "2025-11-19T10:00:00.000Z",
      "campaign": {
        "id": 1,
        "title": "Bantu Pembangunan Gedung Latihan",
        "slug": "bantu-pembangunan-gedung-latihan"
      }
    }
  }
}
```

**Payment Status:**
- `pending` - Menunggu pembayaran
- `settlement` - Pembayaran berhasil
- `expire` - Transaksi kadaluarsa
- `cancel` - Dibatalkan
- `deny` - Ditolak
- `failed` - Gagal

**Frontend Implementation:**
```javascript
const SuccessPage = () => {
  const [donation, setDonation] = useState(null);
  const searchParams = new URLSearchParams(window.location.search);
  const transactionId = searchParams.get('transaction_id');
  
  useEffect(() => {
    fetch(`http://localhost:8015/donasi/donations/check/${transactionId}`)
      .then(res => res.json())
      .then(result => setDonation(result.data.donation));
  }, [transactionId]);
  
  if (!donation) return <Loading />;
  
  return (
    <div className="success-page">
      <h1>✅ Donasi Berhasil!</h1>
      <p>Terima kasih <strong>{donation.donor_name}</strong></p>
      
      <div className="donation-summary">
        <p>Jumlah Donasi: <strong>Rp {parseInt(donation.donation_amount).toLocaleString('id-ID')}</strong></p>
        <p>Biaya Admin: Rp {parseInt(donation.admin_fee).toLocaleString('id-ID')}</p>
        <p>Total Dibayar: Rp {parseInt(donation.total_amount).toLocaleString('id-ID')}</p>
        <p>Metode: {donation.payment_method}</p>
        <p>Status: {donation.payment_status}</p>
        <p>Transaction ID: {donation.transaction_id}</p>
      </div>
      
      <button onClick={() => window.location.href = `/campaign/${donation.campaign.slug}`}>
        Kembali ke Campaign
      </button>
    </div>
  );
};
```

---

## 🔄 COMPLETE FLOW DIAGRAM

```
USER ACTION                    FRONTEND                         BACKEND
────────────────────────────────────────────────────────────────────────────

1. Browse campaigns       →    GET /donasi/campaigns    →   Return list
                               ?status=active&is_published=true

2. Click campaign         →    GET /donasi/campaigns/   →   Return detail
                               {slug}                            + donations
                                                                 + benefits
                                                                 + gallery

3. Click "Donasi"         →    Load modal/form              →   -

4. Load payment methods   →    GET /donasi/             →   Return list
                               payment-methods                   payment methods

5. Fill form & submit     →    POST /donasi/donations   →   Create donation
                               { campaign_id, amount, ... }      + Get snap_token

6. Open Midtrans          →    snap.pay(snap_token)         →   -
                               (Popup muncul)

7. Choose payment         →    (Di Midtrans popup)          →   -
   (BCA VA, GoPay, etc)

8. Complete payment       →    onSuccess callback           →   Webhook triggered
                                                                 (auto update)

9. Redirect success       →    GET /donasi/donations/   →   Return status
                               check/{transaction_id}            "settlement"

10. Show success page     →    Display confirmation         →   -
```

---

## 🎨 UI COMPONENTS NEEDED

### 1. **Campaign Card Component**
```javascript
<CampaignCard 
  campaign={campaign}
  onClick={() => navigate(`/campaign/${campaign.slug}`)}
/>
```

### 2. **Campaign Detail Component**
```javascript
<CampaignDetail 
  slug={slug}
  onDonateClick={() => setShowDonationModal(true)}
/>
```

### 3. **Donation Modal/Form Component**
```javascript
<DonationModal
  campaignId={campaignId}
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={(transactionId) => navigate(`/success?transaction_id=${transactionId}`)}
/>
```

### 4. **Payment Success Component**
```javascript
<PaymentSuccess 
  transactionId={transactionId}
/>
```

---

## 🔐 ENVIRONMENT SETUP

```env
# Backend .env
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
MIDTRANS_IS_PRODUCTION=false
FRONTEND_URL=http://localhost:3000
```

```javascript
// Frontend config
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8015';
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
```

---

## ⚠️ IMPORTANT NOTES

### 1. **Midtrans Snap.js Loading**
Pastikan script dimuat **SEBELUM** user submit form:
```html
<script 
  src="https://app.sandbox.midtrans.com/snap/snap.js" 
  data-client-key="SB-Mid-client-YOUR_KEY">
</script>
```

### 2. **CORS Configuration**
Backend harus allow frontend domain:
```javascript
// Backend app.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### 3. **Error Handling**
Selalu handle error untuk UX yang baik:
```javascript
try {
  // API call
} catch (error) {
  console.error('Error:', error);
  alert('Terjadi kesalahan. Silakan coba lagi.');
}
```

### 4. **Loading States**
Tampilkan loading indicator saat API call:
```javascript
const [loading, setLoading] = useState(false);

// Saat fetch
setLoading(true);
await fetchData();
setLoading(false);
```

### 5. **Validation**
Validate form sebelum submit:
```javascript
if (!donorName || !donorEmail || !amount || !paymentMethodId) {
  alert('Semua field wajib diisi!');
  return;
}

if (amount < 10000) {
  alert('Minimal donasi Rp 10.000');
  return;
}
```

---

## 🧪 TESTING CHECKLIST

- [ ] List campaign muncul dengan benar
- [ ] Detail campaign load lengkap (image, donations, benefits, gallery)
- [ ] Payment methods load dari API
- [ ] Admin fee calculate dengan benar (fixed & percentage)
- [ ] Form validation berfungsi
- [ ] Submit form dapat snap_token
- [ ] Midtrans popup muncul
- [ ] Pilih payment method (BCA VA, GoPay, dll)
- [ ] Payment berhasil → redirect ke success page
- [ ] Status check menampilkan data yang benar
- [ ] Error handling untuk setiap step

---

## 📚 ADDITIONAL RESOURCES

- **Complete Tutorial:** `docs/TUTORIAL_API_DONASI.md`
- **Flow Diagram:** `docs/FLOW_API_DONASI.md`
- **Troubleshooting:** `docs/MIDTRANS_TROUBLESHOOTING.md`
- **VA Fix:** `docs/FIX_VIRTUAL_ACCOUNT.md`
- **Postman Collection:** `postman/Donation_API.postman_collection.json`

---

**Last Updated:** 2025-11-19  
**API Version:** 1.0  
**Status:** ✅ Ready for Integration
