/**
 * ============================================
 * EVENT REGISTRATION - GOOGLE APPS SCRIPT BACKEND
 * ============================================
 * 
 * Purpose: Secure backend to store successful payment data
 * Database: Google Sheets
 * Trigger: Called AFTER Razorpay payment success
 * 
 * Author: Event Management System
 * Version: 1.0.0
 * Last Updated: February 2026
 * ============================================
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Sheet Configuration
  SHEET_NAME: 'Registrations', // Name of the sheet to store data
  
  // Coupon Code Configuration
  COUPON_PREFIX: 'BIDAR-MEET', // Prefix for coupon codes
  COUPON_ID_LENGTH: 5, // Length of random ID (XXXXX)
  
  // Security
  ALLOWED_ORIGINS: [
    // Add your website domains here (for CORS)
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    // For local testing, you can temporarily add:
    // 'http://localhost:8000',
    // 'http://127.0.0.1:8000'
  ],
  
  // Validation
  REQUIRED_FIELDS: ['fullName', 'email', 'mobile', 'paymentId', 'amount'],
  
  // Response Messages
  MESSAGES: {
    SUCCESS: 'Registration saved successfully',
    INVALID_METHOD: 'Only POST requests are allowed',
    MISSING_FIELDS: 'Missing required fields',
    DUPLICATE_PAYMENT: 'Payment ID already exists',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_MOBILE: 'Invalid mobile number format',
    SERVER_ERROR: 'Server error occurred',
    INVALID_DATA: 'Invalid data format'
  }
};

// ============================================
// MAIN ENTRY POINT
// ============================================

/**
 * Main function that handles all HTTP requests
 * This is called when the Web App URL is accessed
 */
function doPost(e) {
  try {
    // Log incoming request for debugging
    Logger.log('Incoming POST request received');
    Logger.log('Request data: ' + JSON.stringify(e));
    
    // Parse the incoming JSON data
    let requestData;
    try {
      requestData = JSON.parse(e.postData.contents);
      Logger.log('Parsed data: ' + JSON.stringify(requestData));
    } catch (parseError) {
      Logger.log('JSON parse error: ' + parseError.toString());
      return createResponse(false, CONFIG.MESSAGES.INVALID_DATA, null, 400);
    }
    
    // Validate request data
    const validation = validateRequest(requestData);
    if (!validation.isValid) {
      Logger.log('Validation failed: ' + validation.message);
      return createResponse(false, validation.message, null, 400);
    }
    
    // Check for duplicate payment ID
    if (isDuplicatePayment(requestData.paymentId)) {
      Logger.log('Duplicate payment ID detected: ' + requestData.paymentId);
      return createResponse(false, CONFIG.MESSAGES.DUPLICATE_PAYMENT, null, 409);
    }
    
    // Generate unique coupon code
    const couponCode = generateCouponCode();
    Logger.log('Generated coupon code: ' + couponCode);
    
    // Save to Google Sheet
    const rowNumber = saveToSheet(requestData, couponCode);
    Logger.log('Data saved to row: ' + rowNumber);
    
    // Send success email (optional - commented out by default)
    // sendConfirmationEmail(requestData.email, requestData.fullName, couponCode);
    
    // Return success response
    return createResponse(true, CONFIG.MESSAGES.SUCCESS, {
      coupon_code: couponCode,
      saved_row_number: rowNumber,
      payment_id: requestData.paymentId
    }, 200);
    
  } catch (error) {
    // Log error for debugging
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    
    // Return error response
    return createResponse(false, CONFIG.MESSAGES.SERVER_ERROR, {
      error: error.toString()
    }, 500);
  }
}

/**
 * Handle GET requests - reject them for security
 */
function doGet(e) {
  Logger.log('GET request rejected');
  return createResponse(false, CONFIG.MESSAGES.INVALID_METHOD, null, 405);
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate incoming request data
 * @param {Object} data - Request data
 * @return {Object} - Validation result
 */
function validateRequest(data) {
  // Check if data exists
  if (!data || typeof data !== 'object') {
    return { isValid: false, message: CONFIG.MESSAGES.INVALID_DATA };
  }
  
  // Check required fields
  for (let field of CONFIG.REQUIRED_FIELDS) {
    if (!data[field] || data[field].toString().trim() === '') {
      return { 
        isValid: false, 
        message: CONFIG.MESSAGES.MISSING_FIELDS + ': ' + field 
      };
    }
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { isValid: false, message: CONFIG.MESSAGES.INVALID_EMAIL };
  }
  
  // Validate mobile number (10 digits)
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(data.mobile)) {
    return { isValid: false, message: CONFIG.MESSAGES.INVALID_MOBILE };
  }
  
  // All validations passed
  return { isValid: true, message: 'Valid' };
}

/**
 * Check if payment ID already exists in the sheet
 * @param {string} paymentId - Razorpay payment ID
 * @return {boolean} - True if duplicate exists
 */
function isDuplicatePayment(paymentId) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    // Skip header row (index 0), check from row 1
    for (let i = 1; i < data.length; i++) {
      // Payment ID is in column F (index 5)
      if (data[i][5] === paymentId) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    Logger.log('Error checking duplicate: ' + error.toString());
    // In case of error, assume not duplicate to allow processing
    return false;
  }
}

// ============================================
// COUPON CODE GENERATION
// ============================================

/**
 * Generate unique coupon code in format: BIDAR-MEET-YYYY-XXXXX
 * @return {string} - Unique coupon code
 */
function generateCouponCode() {
  const year = new Date().getFullYear();
  const randomId = generateRandomId(CONFIG.COUPON_ID_LENGTH);
  
  const couponCode = `${CONFIG.COUPON_PREFIX}-${year}-${randomId}`;
  
  // Ensure uniqueness (recursive check)
  if (isCouponDuplicate(couponCode)) {
    Logger.log('Coupon duplicate detected, regenerating...');
    return generateCouponCode(); // Regenerate if duplicate
  }
  
  return couponCode;
}

/**
 * Generate random alphanumeric ID
 * @param {number} length - Length of ID
 * @return {string} - Random ID
 */
function generateRandomId(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Check if coupon code already exists
 * @param {string} couponCode - Coupon code to check
 * @return {boolean} - True if duplicate
 */
function isCouponDuplicate(couponCode) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      // Coupon code is in column G (index 6)
      if (data[i][6] === couponCode) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    Logger.log('Error checking coupon duplicate: ' + error.toString());
    return false;
  }
}

// ============================================
// GOOGLE SHEET OPERATIONS
// ============================================

/**
 * Get or create the registrations sheet
 * @return {Sheet} - Google Sheet object
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    
    // Add header row
    const headers = [
      'Name', 
      'Email', 
      'Mobile', 
      'City', 
      'Profession', 
      'Payment ID', 
      'Coupon Code', 
      'Amount', 
      'Date/Time'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#16213e');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    Logger.log('Created new sheet: ' + CONFIG.SHEET_NAME);
  }
  
  return sheet;
}

/**
 * Save registration data to Google Sheet
 * @param {Object} data - Registration data
 * @param {string} couponCode - Generated coupon code
 * @return {number} - Row number where data was saved
 */
function saveToSheet(data, couponCode) {
  const sheet = getOrCreateSheet();
  
  // Prepare row data
  const rowData = [
    data.fullName || '',
    data.email || '',
    data.mobile || '',
    data.city || 'Not provided',
    data.profession || 'Not provided',
    data.paymentId || '',
    couponCode,
    data.amount || '500',
    new Date() // Current timestamp
  ];
  
  // Append row to sheet
  sheet.appendRow(rowData);
  
  // Get the row number (last row)
  const lastRow = sheet.getLastRow();
  
  // Format the newly added row
  const rowRange = sheet.getRange(lastRow, 1, 1, rowData.length);
  
  // Alternate row coloring for better readability
  if (lastRow % 2 === 0) {
    rowRange.setBackground('#f8f9fa');
  }
  
  // Format date column
  sheet.getRange(lastRow, 9).setNumberFormat('dd/mm/yyyy hh:mm:ss');
  
  Logger.log('Saved data to row: ' + lastRow);
  
  return lastRow;
}

// ============================================
// RESPONSE CREATION
// ============================================

/**
 * Create JSON response with CORS headers
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @param {Object} data - Additional data
 * @param {number} statusCode - HTTP status code
 * @return {TextOutput} - JSON response
 */
function createResponse(success, message, data, statusCode) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString(),
    statusCode: statusCode || 200
  };
  
  // Add additional data if provided
  if (data) {
    response.data = data;
  }
  
  // Create JSON output
  const output = ContentService.createTextOutput(JSON.stringify(response));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers for web access
  // Note: Apps Script doesn't support custom HTTP headers directly in doPost
  // But we set the MIME type which helps
  
  return output;
}

// ============================================
// OPTIONAL: EMAIL NOTIFICATION
// ============================================

/**
 * Send confirmation email to user (OPTIONAL)
 * Uncomment the call in doPost() to enable
 * 
 * @param {string} email - User's email
 * @param {string} name - User's name
 * @param {string} couponCode - Generated coupon code
 */
function sendConfirmationEmail(email, name, couponCode) {
  try {
    const subject = 'Event Registration Confirmed - ' + couponCode;
    
    const body = `
Dear ${name},

Thank you for registering for our event!

Your registration has been confirmed. Here are your details:

Coupon Code: ${couponCode}
Email: ${email}

Please save this email and bring your coupon code to the event.

Best regards,
Event Management Team
    `.trim();
    
    MailApp.sendEmail(email, subject, body);
    Logger.log('Confirmation email sent to: ' + email);
    
  } catch (error) {
    Logger.log('Error sending email: ' + error.toString());
    // Don't throw error - email is optional
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Test function to verify sheet access
 * Run this from Script Editor to test
 */
function testSheetAccess() {
  try {
    const sheet = getOrCreateSheet();
    Logger.log('Sheet access successful');
    Logger.log('Sheet name: ' + sheet.getName());
    Logger.log('Last row: ' + sheet.getLastRow());
    return true;
  } catch (error) {
    Logger.log('Sheet access failed: ' + error.toString());
    return false;
  }
}

/**
 * Test function to verify coupon generation
 * Run this from Script Editor to test
 */
function testCouponGeneration() {
  const coupon = generateCouponCode();
  Logger.log('Generated coupon: ' + coupon);
  return coupon;
}

/**
 * Test function to simulate a POST request
 * Run this from Script Editor to test
 */
function testPostRequest() {
  const testData = {
    fullName: 'Test User',
    email: 'test@example.com',
    mobile: '9876543210',
    city: 'Bidar',
    profession: 'Software Engineer',
    paymentId: 'pay_test_' + Date.now(), // Unique payment ID
    amount: '500'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const response = doPost(mockEvent);
  const result = JSON.parse(response.getContent());
  
  Logger.log('Test response: ' + JSON.stringify(result, null, 2));
  
  return result;
}

/**
 * Clear all data from sheet (USE WITH CAUTION)
 * Only for testing purposes
 */
function clearAllData() {
  const sheet = getOrCreateSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
    Logger.log('Cleared all data rows');
  } else {
    Logger.log('No data to clear');
  }
}

/**
 * Get statistics about registrations
 * Run this to see total registrations
 */
function getStatistics() {
  const sheet = getOrCreateSheet();
  const lastRow = sheet.getLastRow();
  const totalRegistrations = lastRow - 1; // Subtract header row
  
  Logger.log('Total Registrations: ' + totalRegistrations);
  
  return {
    totalRegistrations: totalRegistrations,
    sheetName: CONFIG.SHEET_NAME,
    lastUpdated: new Date()
  };
}