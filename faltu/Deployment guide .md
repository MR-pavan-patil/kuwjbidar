# Google Apps Script Backend - Deployment Guide

Complete guide to deploy and integrate the Google Sheets backend with your event registration system.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Deploying as Web App](#deploying-as-web-app)
4. [Frontend Integration](#frontend-integration)
5. [Testing](#testing)
6. [Security Configuration](#security-configuration)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Features](#advanced-features)

---

## 1. Prerequisites

### What You Need:
- ✅ Google Account
- ✅ Google Sheets access
- ✅ Basic understanding of web requests
- ✅ Your event registration frontend files

### Time Required:
- Initial setup: ~10 minutes
- Testing & integration: ~15 minutes
- **Total: ~25 minutes**

---

## 2. Initial Setup

### Step 1: Create New Google Sheet

1. **Go to Google Sheets:**
   - Visit: https://sheets.google.com
   - Click **"+ Blank"** to create new spreadsheet

2. **Name Your Sheet:**
   - Click on "Untitled spreadsheet" at top
   - Rename to: **"Event Registrations 2026"** (or your preferred name)

3. **Open Script Editor:**
   - Click **Extensions** → **Apps Script**
   - A new tab will open with script editor

### Step 2: Add the Script Code

1. **Clear Default Code:**
   - Delete any existing code in `Code.gs`

2. **Paste the Backend Code:**
   - Copy entire content from `Code.gs` file
   - Paste into the Apps Script editor

3. **Save the Project:**
   - Click the disk icon or press `Ctrl+S` (Windows) / `Cmd+S` (Mac)
   - Name your project: **"Event Registration Backend"**

### Step 3: Configure Settings

**Edit these settings in the `CONFIG` object (lines 20-40):**

```javascript
const CONFIG = {
  // Sheet name - change if needed
  SHEET_NAME: 'Registrations',
  
  // Coupon prefix - customize for your event
  COUPON_PREFIX: 'BIDAR-MEET',
  
  // Add your website domains here
  ALLOWED_ORIGINS: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  
  // Rest remains the same...
};
```

**Important Customizations:**

- **COUPON_PREFIX**: Change to your event name
  - Example: `'MUMBAI-TECH'` → Generates `MUMBAI-TECH-2026-AB123`
  - Example: `'STARTUP-FEST'` → Generates `STARTUP-FEST-2026-XY789`

- **SHEET_NAME**: Name of the sheet tab (will be auto-created)
  - Default: `'Registrations'`
  - Can be: `'Participants'`, `'Attendees'`, etc.

---

## 3. Deploying as Web App

### Step 1: Test the Script First

**Before deploying, run a test:**

1. **Select test function:**
   - Click dropdown next to "Debug" button
   - Select: **`testSheetAccess`**

2. **Grant Permissions:**
   - Click **Run** (▶ button)
   - A dialog appears: **"Authorization required"**
   - Click **Review Permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow**

3. **Check Logs:**
   - Click **Execution log** at bottom
   - Should see: "Sheet access successful"

4. **Run Full Test:**
   - Select: **`testPostRequest`**
   - Click **Run**
   - Check logs - should see success response with coupon code
   - Check your Google Sheet - should have new data row!

### Step 2: Deploy as Web App

1. **Click Deploy Button:**
   - Top-right corner: **Deploy** → **New deployment**

2. **Configure Deployment:**

   **Type:**
   - Click gear icon ⚙️ next to "Select type"
   - Choose: **Web app**

   **Settings:**
   ```
   Description: Event Registration API v1.0
   
   Execute as: Me (your-email@gmail.com)
   
   Who has access: Anyone
   ```

   ⚠️ **IMPORTANT:** 
   - **Execute as:** MUST be "Me"
   - **Who has access:** MUST be "Anyone" (for web access)

3. **Click Deploy:**
   - Review settings
   - Click **Deploy** button

4. **Copy Web App URL:**
   - A dialog shows: **"Deployment successfully created"**
   - Copy the **Web app URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
   - **SAVE THIS URL!** You'll need it for frontend integration

5. **Authorize Again (if prompted):**
   - Click **Authorize access**
   - Choose account
   - Allow permissions

---

## 4. Frontend Integration

### Step 1: Update Registration Page

**Open your `registration.html` file:**

**Find the `handlePaymentSuccess` function (around line 450):**

```javascript
function handlePaymentSuccess(response) {
    const paymentId = response.razorpay_payment_id;
    
    console.log('Payment ID:', paymentId);
    
    registrationData.paymentId = paymentId;
    
    lockForm();
    
    // ===== ADD THIS NEW CODE =====
    // Send data to Google Sheets backend
    sendToGoogleSheets(registrationData);
    // ===== END NEW CODE =====
    
    sessionStorage.setItem('registrationData', JSON.stringify(registrationData));
    
    setTimeout(() => {
        window.location.href = 'receipt.html';
    }, 1000);
}
```

### Step 2: Add Backend Integration Function

**Add this new function BEFORE the `handlePaymentSuccess` function:**

```javascript
/**
 * Send registration data to Google Sheets backend
 */
function sendToGoogleSheets(data) {
    // YOUR WEB APP URL HERE
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
    
    console.log('Sending data to Google Sheets...', data);
    
    // Prepare data for backend
    const backendData = {
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        city: data.city,
        profession: data.profession,
        paymentId: data.paymentId,
        amount: '500' // or use dynamic amount
    };
    
    // Send POST request to Google Apps Script
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for Google Apps Script
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData)
    })
    .then(response => {
        console.log('Data sent to Google Sheets successfully');
        // Note: With 'no-cors', we can't read the response
        // But the data is still saved
    })
    .catch(error => {
        console.error('Error sending to Google Sheets:', error);
        // Don't block the user flow - just log the error
    });
}
```

**⚠️ CRITICAL: Replace the URL!**

```javascript
// REPLACE THIS LINE:
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

// WITH YOUR ACTUAL WEB APP URL:
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

### Step 3: Enhanced Version (with Coupon Code on Receipt)

**If you want to display the coupon code on receipt page:**

**Option A: Use alternative method (recommended for beginners)**

Since we can't read the response with `no-cors`, we can:
1. Let the backend save data
2. Generate coupon code on frontend too
3. Or fetch it later using payment ID

**Option B: Use CORS proxy (advanced)**

Deploy the script with different access settings and use a CORS proxy.

**For now, use Option A - the backend will save everything, and you can manually check the sheet for coupon codes.**

---

## 5. Testing

### Test Flow:

#### 1. Test Backend Independently

**In Apps Script Editor:**

```javascript
// Run this function
function testPostRequest() {
  // ... (already in code)
}
```

**Expected Result:**
- ✅ No errors
- ✅ New row in Google Sheet
- ✅ Coupon code generated
- ✅ All fields populated

#### 2. Test Frontend Integration

**Open `registration.html` in browser:**

1. Fill in the form:
   ```
   Name: Test User
   Email: test@example.com
   Mobile: 9876543210
   City: Bangalore
   Profession: Student
   ```

2. Click "Proceed to Secure Payment"

3. Use test card:
   ```
   Card: 4111 1111 1111 1111
   CVV: 123
   Expiry: 12/25
   ```

4. Complete payment

5. **Check Console:**
   - Press `F12` → Console tab
   - Look for: "Data sent to Google Sheets successfully"

6. **Check Google Sheet:**
   - Refresh your Google Sheet
   - New row should appear with all data
   - Coupon code should be generated

#### 3. Test Edge Cases

**Test Duplicate Payment:**
1. Note the payment ID from a successful test
2. Manually run script with same payment ID
3. Should reject with "Payment ID already exists"

**Test Missing Fields:**
1. Send request without email
2. Should get validation error

**Test Invalid Data:**
1. Send invalid email format
2. Send 9-digit mobile number
3. Should get appropriate errors

---

## 6. Security Configuration

### Current Security Features:

✅ **No GET requests allowed** - Only POST
✅ **Required field validation** - Can't submit empty data
✅ **Duplicate payment prevention** - Same payment ID rejected
✅ **Email format validation** - Must be valid email
✅ **Mobile validation** - Must be 10 digits
✅ **Data sanitization** - All inputs are checked

### Additional Security (Optional):

#### 1. API Key Protection

**Add API key validation in Apps Script:**

```javascript
// In CONFIG
API_KEY: 'your-secret-key-here',

// In validateRequest function
if (data.apiKey !== CONFIG.API_KEY) {
    return { isValid: false, message: 'Invalid API key' };
}
```

**In Frontend:**

```javascript
const backendData = {
    apiKey: 'your-secret-key-here',
    fullName: data.fullName,
    // ... rest of data
};
```

#### 2. Timestamp Validation

**Reject old requests:**

```javascript
// Add to validation
const requestTime = new Date(data.timestamp);
const now = new Date();
const diffMinutes = (now - requestTime) / 1000 / 60;

if (diffMinutes > 5) { // Reject requests older than 5 minutes
    return { isValid: false, message: 'Request expired' };
}
```

#### 3. Rate Limiting

**Limit requests from same IP:**

```javascript
// Use Apps Script Cache Service
const cache = CacheService.getScriptCache();
const cacheKey = 'rate_limit_' + data.email;

if (cache.get(cacheKey)) {
    return { isValid: false, message: 'Too many requests' };
}

cache.put(cacheKey, 'true', 60); // Block for 60 seconds
```

---

## 7. Troubleshooting

### Common Issues & Solutions:

#### Issue 1: "Authorization required" error

**Cause:** Script needs permission to access your Google Sheet

**Solution:**
1. In Apps Script, click **Run** on any test function
2. Click **Review Permissions**
3. Choose your account
4. Click **Advanced** → **Go to [Project Name]**
5. Click **Allow**

---

#### Issue 2: "Exception: Service invoked too many times" error

**Cause:** Google has rate limits (typically 20,000 calls/day)

**Solution:**
- For most events, this is fine
- If you expect more, consider batch processing
- Or use Google Sheets API with quota increase

---

#### Issue 3: Data not saving to sheet

**Checklist:**
1. ✅ Check script URL is correct in frontend
2. ✅ Verify deployment is active (not expired)
3. ✅ Check Apps Script logs for errors:
   - Apps Script Editor → **Executions** tab (left sidebar)
   - Look for failed executions
4. ✅ Ensure sheet name in CONFIG matches actual sheet

**Debug Steps:**
```javascript
// In Apps Script, check logs
Logger.log('Data received: ' + JSON.stringify(requestData));

// In Frontend, check console
console.log('Sending data:', backendData);
```

---

#### Issue 4: "TypeError: Cannot read property 'postData'"

**Cause:** Request format is incorrect

**Solution:**
Ensure frontend sends proper JSON:
```javascript
body: JSON.stringify(backendData)  // ✅ Correct
// NOT:
body: backendData  // ❌ Wrong
```

---

#### Issue 5: CORS errors in browser console

**This is NORMAL with `no-cors` mode!**

**Why:** Google Apps Script doesn't support custom CORS headers easily

**Solution:** 
- Use `mode: 'no-cors'` in fetch (already in code)
- Data still gets saved even though you see error
- Check Google Sheet to verify

**Alternative:**
- Deploy script as API executable
- Use Google's CORS proxy
- (More complex - not needed for basic use)

---

#### Issue 6: Duplicate coupon codes

**Cause:** Multiple requests at exact same time

**Solution:**
- Code already checks for duplicates
- Re-generates if duplicate found
- If still issues, increase `COUPON_ID_LENGTH` to 6 or 7

---

#### Issue 7: Email notifications not sending

**Cause:** Gmail daily limit (100 emails/day for free accounts)

**Solution:**
- Email feature is optional (commented out by default)
- If needed, uncomment in `doPost()` function
- For high volume, use external email service (SendGrid, etc.)

---

## 8. Advanced Features

### Feature 1: Export to CSV

**Add this function to Apps Script:**

```javascript
function exportToCSV() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  
  // Convert to CSV
  const csv = data.map(row => row.join(',')).join('\n');
  
  // Save to Drive
  const fileName = 'Registrations_' + new Date().toISOString().split('T')[0] + '.csv';
  DriveApp.createFile(fileName, csv, MimeType.CSV);
  
  Logger.log('CSV exported: ' + fileName);
}
```

### Feature 2: Send Bulk Emails

**Send emails to all registrants:**

```javascript
function sendBulkEmail() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const email = data[i][1];
    const name = data[i][0];
    const coupon = data[i][6];
    
    sendConfirmationEmail(email, name, coupon);
    
    // Wait 1 second between emails to avoid rate limits
    Utilities.sleep(1000);
  }
  
  Logger.log('Sent ' + (data.length - 1) + ' emails');
}
```

### Feature 3: Real-time Dashboard

**Create a separate sheet for statistics:**

```javascript
function createDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let dashboard = ss.getSheetByName('Dashboard');
  
  if (!dashboard) {
    dashboard = ss.insertSheet('Dashboard');
  }
  
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  
  // Statistics
  const total = data.length - 1;
  const cities = {};
  const professions = {};
  
  for (let i = 1; i < data.length; i++) {
    const city = data[i][3] || 'Not provided';
    const profession = data[i][4] || 'Not provided';
    
    cities[city] = (cities[city] || 0) + 1;
    professions[profession] = (professions[profession] || 0) + 1;
  }
  
  // Write to dashboard
  dashboard.clear();
  dashboard.getRange('A1').setValue('Total Registrations:');
  dashboard.getRange('B1').setValue(total);
  
  // More statistics...
}
```

### Feature 4: QR Code Generation

**Generate QR code for each coupon:**

```javascript
function generateQRCode(couponCode) {
  const url = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + 
              encodeURIComponent(couponCode);
  return url;
}

// Add to saveToSheet function:
const qrUrl = generateQRCode(couponCode);
// Save qrUrl to sheet
```

---

## 9. Deployment Checklist

### Before Going Live:

- [ ] Test with at least 5 sample registrations
- [ ] Verify all data fields are saving correctly
- [ ] Check coupon code generation works
- [ ] Test duplicate payment rejection
- [ ] Verify email/mobile validation
- [ ] Update CONFIG with your event name
- [ ] Replace Web App URL in frontend
- [ ] Test on mobile devices
- [ ] Clear test data from sheet
- [ ] Create backup of Apps Script code
- [ ] Document the Web App URL securely

### Launch Day:

- [ ] Monitor Apps Script executions tab
- [ ] Check Google Sheet regularly
- [ ] Have test account ready for troubleshooting
- [ ] Keep Apps Script editor open in a tab
- [ ] Monitor error logs

### Post-Event:

- [ ] Export data to CSV backup
- [ ] Send confirmation emails if needed
- [ ] Generate reports and statistics
- [ ] Archive the Google Sheet
- [ ] Disable Web App deployment if done

---

## 10. Quick Reference

### Important URLs:

```
Google Sheets: https://sheets.google.com
Apps Script: https://script.google.com

Your Sheet: [Bookmark your sheet URL]
Your Web App: [Save your deployment URL]
```

### Key Functions:

```javascript
testSheetAccess()      // Test sheet connection
testPostRequest()      // Test full flow
testCouponGeneration() // Test coupon codes
getStatistics()        // View registration count
clearAllData()         // Clear all data (careful!)
```

### Support Contacts:

- Google Apps Script Help: https://developers.google.com/apps-script
- Razorpay Support: https://razorpay.com/support
- Stack Overflow: Tag with `google-apps-script`

---

## 🎉 You're All Set!

Your backend is now ready to receive and store event registrations securely.

**Next Steps:**
1. Deploy the script
2. Update frontend with Web App URL
3. Test thoroughly
4. Launch your event registration!

**Questions?** Check the troubleshooting section or review the code comments.

Good luck with your event! 🚀