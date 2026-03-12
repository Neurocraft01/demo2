/**
 * AKS Automations - Google Sheets to Supabase Webhook
 * 
 * Instructions:
 * 1. Open your Google Sheet where Meta Ads leads are saved.
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any code there and paste this entire file.
 * 4. Update the CONFIG object below with your actual webhook URL and secret.
 * 5. Run the `setupTrigger` function once to automatically send new leads.
 * 6. (Optional) You can run `syncAllRows` to send all existing leads.
 */

const CONFIG = {
  // The URL of your Next.js API endpoint
  WEBHOOK_URL: 'https://your-domain.com/api/sync-google-leads',
  // The CRON_SECRET from your .env.local file
  SECRET: 'your_cron_secret_here',
  // The name of the sheet tab with the leads
  SHEET_NAME: 'Sheet1'
};

/**
 * Triggered automatically when the sheet changes (e.g. Meta Ads adds a row)
 */
function onChange(e) {
  // If the change is an insert row, we process the latest rows
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return;
  
  // To keep it simple, we just send the last 5 rows whenever a change happens.
  // The Next.js API handles deduplication so it's safe to send duplicates.
  const lastRow = sheet.getLastRow();
  const numRows = Math.min(5, lastRow - 1); // Get up to 5 last rows, excluding header
  
  if (numRows <= 0) return;
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const dataRange = sheet.getRange(lastRow - numRows + 1, 1, numRows, sheet.getLastColumn());
  const data = dataRange.getValues();
  
  const payload = formatPayload(headers, data);
  sendToWebhook(payload);
}

/**
 * Run this function manually from the editor to sync all existing leads
 */
function syncAllRows() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    Logger.log("Sheet not found: " + CONFIG.SHEET_NAME);
    return;
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    Logger.log("No data to sync");
    return;
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
  
  // Process in batches of 50 to avoid timeout
  const batchSize = 50;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const payload = formatPayload(headers, batch);
    sendToWebhook(payload);
    Utilities.sleep(1000); // 1 second pause between batches
  }
  
  Logger.log("Successfully synced " + data.length + " rows.");
}

/**
 * Run this function ONCE to set up the automatic trigger
 */
function setupTrigger() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger('onChange')
    .forSpreadsheet(sheet)
    .onChange()
    .create();
  Logger.log("Trigger setup complete. New leads will be synced automatically.");
}

// --- Helper Functions ---

function formatPayload(headers, rows) {
  // Clean headers (lowercase, replace spaces with underscores)
  const cleanHeaders = headers.map(h => String(h).trim().toLowerCase().replace(/\s+/g, '_'));
  
  const formattedRows = rows.map((row, index) => {
    const obj = { _row_index: index }; // Keep track for debugging
    cleanHeaders.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
  
  return {
    secret: CONFIG.SECRET,
    rows: formattedRows
  };
}

function sendToWebhook(payload) {
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
    Logger.log("Response: " + response.getContentText());
  } catch (e) {
    Logger.log("Error sending webhook: " + e.message);
  }
}
