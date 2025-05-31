# 🚀 Cloudinary Payment Proof Upload Setup

## Overview

This setup automates payment proof image uploads using Cloudinary for the checkout process, eliminating manual file handling and providing secure cloud storage.

## Prerequisites

- Cloudinary account ([Sign up here](https://cloudinary.com/))
- Cloudinary cloud name and upload preset configured

## Setup Steps

### 1. Cloudinary Configuration

#### a) Create Upload Preset

1. Login to your Cloudinary dashboard
2. Go to **Settings > Upload**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `payment_proofs_preset` (or your preferred name)
   - **Signing Mode**: `Unsigned` (for direct browser uploads)
   - **Folder**: `payment-proofs` (organizes uploads)
   - **Format**: `Auto`
   - **Quality**: `Auto`
   - **Max file size**: `10MB`
   - **Allowed formats**: `jpg,png,jpeg,webp`
5. **Save** the preset

#### b) Get Your Credentials

1. Go to **Dashboard > Account Details**
2. Copy your **Cloud Name**

### 2. Environment Configuration

Create a `.env` file in your project root (if not exists):

```env
# Backend API Configuration
VITE_API_URL=http://localhost:5286

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=payment_proofs_preset
```

**Important:** Replace `your_cloud_name_here` with your actual Cloudinary cloud name.

### 3. Features Implemented

#### ✅ Frontend Features

- **Direct Upload**: Images upload directly to Cloudinary from browser
- **Real-time Preview**: Users see uploaded image immediately
- **Progress Indication**: Loading states during upload
- **Error Handling**: User-friendly error messages
- **File Validation**: Size and format restrictions
- **Drag & Drop**: Intuitive upload interface

#### ✅ Backend Integration

- **PaymentProofUrl Field**: Added to Order entity and API
- **Database Migration**: Automatically created
- **API Compatibility**: Request/Response models updated
- **Secure Storage**: URLs stored in database, files in Cloudinary

#### ✅ Order Flow Integration

- **Automated Upload**: Upload happens during checkout
- **Order Placement**: Payment proof URL sent with order
- **Validation**: Order requires payment proof before submission
- **User Feedback**: Toast notifications for success/error states

### 4. Usage Instructions

#### For Users (Checkout Process):

1. **Add items to cart** and proceed to checkout
2. **Select delivery address** from saved addresses
3. **Make UPI payment** to the specified UPI ID
4. **Upload payment screenshot**:
   - Click the upload area
   - Select image file (PNG, JPG, up to 10MB)
   - Wait for upload confirmation
5. **Place order** - order includes payment proof URL

#### For Developers:

```tsx
// Using the CloudinaryUpload component
<CloudinaryUpload
  onUploadSuccess={(url) => setPaymentProofUrl(url)}
  onUploadError={(error) => console.error(error)}
  maxFileSize={10}
  disabled={false}
/>
```

### 5. Security Features

- **Unsigned Upload Presets**: Secure direct uploads without exposing API secrets
- **Folder Organization**: Payment proofs organized in dedicated folder
- **File Validation**: Client and server-side validation
- **Size Limits**: Maximum 10MB file size
- **Format Restrictions**: Only image formats allowed

### 6. Database Changes

#### Migration: `AddPaymentProofUrlToOrder`

```sql
ALTER TABLE Orders ADD PaymentProofUrl NVARCHAR(500) NULL;
```

#### Models Updated:

- `OrderEntity.cs` - Added PaymentProofUrl property
- `Order.cs` (Application Model) - Added PaymentProofUrl property
- `OrderCreateRequest.cs` - Added PaymentProofUrl property
- `OrderRequest.ts` (Frontend) - Added paymentProofUrl property

### 7. API Changes

#### Request Format:

```json
{
  "orderProducts": [{ "productId": 1, "quantity": 2 }],
  "totalAmount": 2499.0,
  "shippingAddress": "John Doe, 123 Main St...",
  "paymentProofUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/payment-proofs/screenshot.jpg"
}
```

### 8. Troubleshooting

#### Common Issues:

**1. Upload Fails - "Configuration missing"**

- Verify `.env` file has correct `VITE_CLOUDINARY_CLOUD_NAME`
- Ensure upload preset exists and is unsigned

**2. Upload Fails - "Upload preset not found"**

- Check preset name in `.env` matches Cloudinary dashboard
- Verify preset is set to "unsigned" mode

**3. File Too Large**

- Default limit is 10MB, adjust if needed
- Check Cloudinary account limits

**4. Order Placement Fails**

- Ensure payment proof is uploaded before placing order
- Check backend migration was applied

### 9. Testing

#### Manual Testing:

1. Start both frontend and backend servers
2. Add items to cart and go to checkout
3. Upload a test image (screenshot/photo)
4. Verify image appears in Cloudinary dashboard
5. Complete order and check database for PaymentProofUrl

#### Verification:

- Check Cloudinary dashboard for uploaded files
- Verify database orders table has PaymentProofUrl values
- Test error scenarios (large files, wrong formats)

### 10. Production Considerations

#### Before Going Live:

- [ ] Update upload preset to **signed mode** for production
- [ ] Set up Cloudinary transformations for optimization
- [ ] Configure CDN delivery settings
- [ ] Add backup/retention policies
- [ ] Monitor storage usage and costs
- [ ] Set up webhook notifications (optional)

#### Performance Optimization:

- Images automatically optimized by Cloudinary
- CDN delivery for fast loading
- Progressive upload with preview

---

## 🎉 **COMPLETE AUTOMATION ACHIEVED**

✅ **No more manual uploads**  
✅ **Secure cloud storage**  
✅ **Real-time preview**  
✅ **Full API integration**  
✅ **Database persistence**  
✅ **Error handling**

Your payment proof upload process is now fully automated!
