# Okkyno.com Admin Guide

Welcome to the Okkyno.com administration guide. This document explains how to manage your gardening e-commerce website.

## 🔐 Admin Login

### Credentials

- **Username:** `admin`
- **Password:** `admin123`

### How to Login

1. Go to [/login](/login)
2. Enter the credentials above
3. After login, go to [/admin](/admin) to access the dashboard

---

## 📊 Admin Dashboard Overview

Access the admin panel at: **yoursite.com/admin**

### Navigation Menu

| Section | Description |
|---------|-------------|
| **Dashboard** | Overview of sales, orders, and statistics |
| **Products** | Manage product listings |
| **Categories** | Organize product categories |
| **Orders** | View and manage customer orders |
| **Blogs** | Create and edit blog posts |
| **Content** | Import content from Epic Gardening |
| **Settings** | Configure site settings & payment gateways |

---

## 💳 Payment Settings

Navigate to: **Admin → Settings → 💳 Payments**

### NOWPayments (Cryptocurrency)

Your crypto payment gateway is pre-configured with your API key.

**Status:** ✅ Active

**Accepts:** Bitcoin, Ethereum, USDT, and 150+ cryptocurrencies

**Configuration:**

- API Key: Already configured (45R77CP-T8ZMVQT-K4ASMB3-2DKJYAT)
- Click "Test Connection" to verify it's working

### PayPal

**Status:** ⚠️ Not Configured

To enable PayPal:

1. Go to PayPal Developer Portal
2. Create a Business account
3. Get your Client ID and Client Secret
4. Enter them in Admin → Settings → Payments

### Other Payment Methods

- **Credit Card (Manual):** Collect card details for manual processing
- **Bank Transfer:** Provide bank details for wire transfers

---

## 🛒 Managing Products

Navigate to: **Admin → Products**

### Add New Product

1. Click "Add Product" button
2. Fill in product details:
   - Name
   - Description
   - Price
   - Category
   - Images
   - Stock quantity
3. Click "Save Product"

### Edit Existing Product

1. Find the product in the list
2. Click the edit icon
3. Make your changes
4. Click "Update"

---

## 📝 Managing Blog Posts

Navigate to: **Admin → Blogs**

### Create New Blog Post

1. Click "New Post"
2. Enter:
   - Title
   - Content (with formatting)
   - Featured image
   - Category
3. Click "Publish"

### Edit Blog Post

1. Find the post in the list
2. Click "Edit"
3. Make changes
4. Click "Update"

---

## 📥 Import Content from Epic Gardening

Navigate to: **Admin → Content**

### How to Import

1. Go to the Content page
2. Click "Start Import"
3. Wait for the import to complete
4. Review imported products and blogs

**What gets imported:**

- Products with images
- Blog posts
- Categories
- Videos

---

## ⚙️ General Settings

Navigate to: **Admin → Settings**

### Available Tabs

1. **General** - Site name, logo, contact info
2. **Store** - Currency, tax rates, shipping
3. **💳 Payments** - Payment gateway configuration
4. **Email** - Email templates and SMTP settings
5. **Security** - Password policies, 2FA
6. **SEO** - Meta titles, descriptions
7. **Appearance** - Theme colors, layout
8. **Features** - Enable/disable site features
9. **AI & Images** - AI image generation settings

---

## 🆘 Troubleshooting

### Login Not Working

1. Make sure you're using: `admin` / `admin123`
2. Clear your browser cache
3. Try a different browser

### Products Not Showing

1. Check if products are marked as "Active"
2. Verify product has valid images
3. Ensure stock quantity > 0

### Payment Issues

1. Go to Settings → Payments
2. Click "Test Connection" for NOWPayments
3. Verify API key is correct

---

## 📞 Need Help?

If you encounter any issues not covered here, please contact your developer.

---

*Last updated: January 2026*
