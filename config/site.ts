// Configuration file for customer-specific settings
// Update these values for each deployment

export const config = {
  // Support Contact Information
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || '917975585413',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@arecamart.com',
  
  // WhatsApp Contact (without + or country code prefix)
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917975585413',
  
  // Business Name
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'ArecaMart',
}
