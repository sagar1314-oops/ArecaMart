# ArecaMart Configuration Guide

## Customer-Specific Settings

This application uses a centralized configuration system to make it easy to customize for different customers without rebuilding the app.

### Configuration File Location
`config/site.ts`

### Available Settings

```typescript
export const config = {
  // Support phone number (without + prefix)
  supportPhone: '918123456789',
  
  // Support email
  supportEmail: 'support@arecamart.com',
  
  // WhatsApp number (without + prefix)
  whatsappNumber: '918123456789',
  
  // Business name
  businessName: 'ArecaMart',
}
```

### How to Customize for Each Customer

**Option 1: Edit the config file directly (Recommended for simple deployments)**
1. Open `config/site.ts`
2. Update the default values
3. Rebuild and deploy

**Option 2: Use environment variables (Recommended for multiple deployments)**
1. Create a `.env.local` file in the project root
2. Add your custom values:
   ```
   NEXT_PUBLIC_SUPPORT_PHONE=919876543210
   NEXT_PUBLIC_SUPPORT_EMAIL=support@customername.com
   NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
   NEXT_PUBLIC_BUSINESS_NAME=CustomBusinessName
   ```
3. The app will automatically use these values
4. Rebuild and deploy

### Where These Settings Are Used

- **Contact Seller buttons** - Uses `whatsappNumber`
- **Help & Support section** - Uses `supportPhone`, `supportEmail`, `whatsappNumber`
- **Help Center page** - Uses `supportPhone`, `supportEmail`, `whatsappNumber`

### Important Notes

1. **Phone Number Format**: Use international format without the + sign
   - Example: `918123456789` (not `+91 81234 56789`)

2. **No Rebuild Required** (when using environment variables):
   - You can change values in `.env.local` without rebuilding
   - Just restart the Next.js server

3. **Build Once, Deploy Many**:
   - Build the app once
   - For each customer, just provide a different `.env.local` file
   - This makes it easy to manage multiple customer deployments

### Example Deployment Workflow

```bash
# Build the app once
npm run build

# For Customer A
cp .env.customer-a .env.local
npm start

# For Customer B  
cp .env.customer-b .env.local
npm start
```

This way, you maintain one codebase and one build, but can easily customize for each customer!
