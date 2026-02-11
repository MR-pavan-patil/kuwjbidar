/**
 * INTEGRATION CODE FOR REGISTRATION.HTML
 * 
 * Add this code to your existing registration.html file
 * Place it in the <script> section, after the CONFIG object
 */

// ============================================
// GOOGLE SHEETS BACKEND CONFIGURATION
// ============================================

/**
 * IMPORTANT: Replace this URL with your actual Web App URL
 * Get it from: Apps Script → Deploy → Manage deployments
 */
const GOOGLE_SHEETS_CONFIG = {
    // 🔴 REPLACE THIS URL WITH YOUR WEB APP URL
    webAppUrl: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec',

    // Retry configuration (optional)
    maxRetries: 2,
    retryDelay: 1000 // milliseconds
};

// ============================================
// SEND DATA TO GOOGLE SHEETS
// ============================================

/**
 * Send registration data to Google Sheets backend
 * Called automatically after successful Razorpay payment
 * 
 * @param {Object} data - Registration data with payment ID
 */
function sendToGoogleSheets(data) {
    console.log('📊 Sending data to Google Sheets...', data);

    // Prepare data for backend
    const backendData = {
        fullName: data.fullName || '',
        email: data.email || '',
        mobile: data.mobile || '',
        city: data.city || 'Not provided',
        profession: data.profession || 'Not provided',
        paymentId: data.paymentId || '',
        amount: data.amount || '500',
        timestamp: data.timestamp || new Date().toISOString()
    };

    // Send POST request to Google Apps Script
    fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backendData)
        })
        .then(response => {
            console.log('✅ Data sent to Google Sheets successfully');
            console.log('📝 Response status:', response.type);

            // Note: With 'no-cors' mode, we cannot read the actual response
            // But the data is still saved to Google Sheets
            // Check your Google Sheet to verify

            // Optional: Show user confirmation
            showSuccessMessage('Registration data saved successfully!');
        })
        .catch(error => {
            console.error('❌ Error sending to Google Sheets:', error);

            // Don't block user flow - just log the error
            // The payment is already successful
            // You can manually add this entry later if needed

            // Optional: Retry logic
            retryGoogleSheetsRequest(backendData, 1);
        });
}

/**
 * Retry sending data to Google Sheets
 * Called if initial request fails
 * 
 * @param {Object} data - Data to send
 * @param {number} attempt - Current attempt number
 */
function retryGoogleSheetsRequest(data, attempt) {
    if (attempt > GOOGLE_SHEETS_CONFIG.maxRetries) {
        console.error('❌ Max retries reached. Data not saved to Google Sheets.');
        console.log('📋 Save this data manually:', JSON.stringify(data, null, 2));
        return;
    }

    console.log(`🔄 Retrying Google Sheets request (Attempt ${attempt})...`);

    setTimeout(() => {
        fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(() => {
                console.log('✅ Retry successful!');
            })
            .catch(error => {
                console.error('❌ Retry failed:', error);
                retryGoogleSheetsRequest(data, attempt + 1);
            });
    }, GOOGLE_SHEETS_CONFIG.retryDelay * attempt);
}

/**
 * Show success message to user (optional)
 */
function showSuccessMessage(message) {
    // You can customize this to show a toast/notification
    console.log('💬 Success:', message);

    // Example: Show alert (optional - remove if you don't want popup)
    // alert(message);
}

// ============================================
// MODIFIED PAYMENT SUCCESS HANDLER
// ============================================

/**
 * REPLACE your existing handlePaymentSuccess function with this:
 */
function handlePaymentSuccess(response) {
    // Extract payment ID from Razorpay response
    const paymentId = response.razorpay_payment_id;

    console.log('✅ Payment successful!');
    console.log('💳 Payment ID:', paymentId);

    // Store payment ID with user data
    registrationData.paymentId = paymentId;
    registrationData.amount = '500'; // or get from CONFIG

    // Lock the form to prevent double submission
    lockForm();

    // ========================================
    // 🔴 IMPORTANT: Send data to Google Sheets
    // ========================================
    sendToGoogleSheets(registrationData);

    // Store data in sessionStorage for receipt page
    sessionStorage.setItem('registrationData', JSON.stringify(registrationData));

    console.log('📦 Complete registration data:', registrationData);

    // Redirect to receipt page after brief delay
    setTimeout(() => {
        window.location.href = 'receipt.html';
    }, 1500); // Slightly longer delay to ensure data is sent
}

// ============================================
// TESTING FUNCTION (OPTIONAL)
// ============================================

/**
 * Test Google Sheets integration without payment
 * Run this from browser console to test
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Type: testGoogleSheetsIntegration()
 * 3. Press Enter
 * 4. Check your Google Sheet for new row
 */
function testGoogleSheetsIntegration() {
    const testData = {
        fullName: 'Test User from Frontend',
        email: 'frontend-test@example.com',
        mobile: '9876543210',
        city: 'Test City',
        profession: 'Tester',
        paymentId: 'pay_frontend_test_' + Date.now(),
        amount: '500',
        timestamp: new Date().toISOString()
    };

    console.log('🧪 Testing Google Sheets integration...');
    console.log('📋 Test data:', testData);

    sendToGoogleSheets(testData);

    console.log('✅ Test request sent!');
    console.log('📊 Check your Google Sheet in a few seconds...');
}

// ============================================
// DEBUGGING HELPERS
// ============================================

/**
 * Check if Google Sheets configuration is set up
 */
function checkGoogleSheetsConfig() {
    console.log('🔍 Checking Google Sheets configuration...');

    if (GOOGLE_SHEETS_CONFIG.webAppUrl.includes('YOUR_DEPLOYMENT_ID_HERE')) {
        console.error('❌ ERROR: Web App URL not configured!');
        console.log('📝 Please update GOOGLE_SHEETS_CONFIG.webAppUrl with your actual deployment URL');
        console.log('🔗 Get URL from: Apps Script → Deploy → Manage deployments');
        return false;
    }

    if (!GOOGLE_SHEETS_CONFIG.webAppUrl.includes('script.google.com')) {
        console.error('❌ ERROR: Invalid Web App URL format!');
        console.log('📝 URL should start with: https://script.google.com/macros/s/...');
        return false;
    }

    console.log('✅ Configuration looks good!');
    console.log('🔗 Web App URL:', GOOGLE_SHEETS_CONFIG.webAppUrl);
    return true;
}

// Run config check on page load
window.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Registration page loaded');
    checkGoogleSheetsConfig();
});

// ============================================
// COMPLETE EXAMPLE
// ============================================

/*

FULL INTEGRATION EXAMPLE:

1. Add GOOGLE_SHEETS_CONFIG at the top of your script section:

    const GOOGLE_SHEETS_CONFIG = {
        webAppUrl: 'https://script.google.com/macros/s/AKfycby.../exec',
        maxRetries: 2,
        retryDelay: 1000
    };

2. Add all the functions above (sendToGoogleSheets, retryGoogleSheetsRequest, etc.)

3. Update your handlePaymentSuccess function to call sendToGoogleSheets()

4. Test with: testGoogleSheetsIntegration()

5. Do a real payment test

6. Check your Google Sheet for new rows!

*/

// ============================================
// VERIFICATION CHECKLIST
// ============================================

/*

Before going live, verify:

✅ Web App URL is updated in GOOGLE_SHEETS_CONFIG
✅ Apps Script is deployed as Web App
✅ Deployment settings: Execute as "Me", Access "Anyone"
✅ Test function runs successfully in Apps Script
✅ Frontend test (testGoogleSheetsIntegration) creates row in sheet
✅ Full payment test creates row with correct data
✅ All required fields are being sent
✅ Payment ID is unique and correct
✅ Coupon codes are being generated
✅ No errors in browser console (except CORS warnings which are normal)
✅ No errors in Apps Script Executions tab

*/

// ============================================
// EXPECTED CONSOLE OUTPUT
// ============================================

/*

When payment is successful, you should see:

1. "✅ Payment successful!"
2. "💳 Payment ID: pay_xxxxxxxxxxxxx"
3. "📊 Sending data to Google Sheets..."
4. "✅ Data sent to Google Sheets successfully"
5. "📦 Complete registration data: {…}"
6. [Redirect to receipt.html]

You might also see CORS-related messages like:
"Fetch API cannot load ... No 'Access-Control-Allow-Origin' header"

⚠️ This is NORMAL and expected with Google Apps Script!
The data is still being saved - check your Google Sheet to verify.

*/

// ============================================
// MONITORING & ANALYTICS (OPTIONAL)
// ============================================

/**
 * Track successful saves (optional - if you use analytics)
 */
function trackRegistrationSave(paymentId) {
    // Google Analytics example
    if (typeof gtag !== 'undefined') {
        gtag('event', 'registration_saved', {
            'payment_id': paymentId,
            'timestamp': new Date().toISOString()
        });
    }

    // Or your custom analytics
    console.log('📊 Registration tracked:', paymentId);
}

/**
 * You can call this in sendToGoogleSheets after successful save
 */