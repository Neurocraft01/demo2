// ============================================================
// AKS Automations — Facebook Leads → Google Sheets Sync
// Google Apps Script (paste into script.google.com)
// Runs every 15 minutes automatically via a trigger
// ============================================================

// ─── 🔧 CONFIGURATION — Fill these in ────────────────────────
var CONFIG = {
  // From: Meta App → Graph API Explorer (leads_retrieval + pages_manage_ads permissions)
  PAGE_ACCESS_TOKEN: 'YOUR_FACEBOOK_PAGE_ACCESS_TOKEN_HERE',

  // Your Facebook Lead Ad Form ID(s) — separate multiple with commas
  // Find it: Ads Manager → Your Lead Ad → Edit → Instant Form → Form ID
  // OR: graph.facebook.com/v25.0/{PAGE_ID}/leadgen_forms?access_token={TOKEN}
  FORM_IDS: [
    'YOUR_FORM_ID_HERE',          // e.g. '1234567890123456'
    // 'ANOTHER_FORM_ID_HERE',    // add more forms if needed
  ],

  // Google Sheet tab name — will be created if it doesn't exist
  SHEET_NAME: 'Facebook Leads',

  // How many leads to fetch per form per run (max 100)
  PAGE_LIMIT: 100,

  // Graph API version
  API_VERSION: 'v25.0',
};

// ─── Column headers in Google Sheet ──────────────────────────
var HEADERS = [
  'Lead ID',
  'Date Received',
  'Full Name',
  'Email',
  'Phone Number',
  'City',
  'Service Interest',
  'Message',
  'Status',
  'Form ID',
  'Ad ID',
  'Ad Name',
];

// ─── MAIN: Sync all leads ─────────────────────────────────────
function syncFacebookLeads() {
  var sheet = getOrCreateSheet();
  ensureHeaders(sheet);

  var existingLeadIds = getExistingLeadIds(sheet);
  var newLeadsCount = 0;

  CONFIG.FORM_IDS.forEach(function (formId) {
    var leads = fetchLeadsFromFacebook(formId);

    leads.forEach(function (lead) {
      // Skip if already in sheet (deduplication)
      if (existingLeadIds.has(String(lead.id))) return;

      var row = buildRow(lead, formId);
      sheet.appendRow(row);
      formatLastRow(sheet);
      newLeadsCount++;
    });
  });

  Logger.log('✅ Sync complete. New leads added: ' + newLeadsCount);

  // Send yourself a summary email if new leads came in
  if (newLeadsCount > 0) {
    sendSummaryEmail(newLeadsCount);
  }
}

// ─── Fetch leads from Facebook Graph API ─────────────────────
function fetchLeadsFromFacebook(formId) {
  var url = 'https://graph.facebook.com/' + CONFIG.API_VERSION + '/' +
    formId + '/leads' +
    '?fields=id,created_time,field_data,ad_id,ad_name,adset_id,form_id' +
    '&limit=' + CONFIG.PAGE_LIMIT +
    '&access_token=' + CONFIG.PAGE_ACCESS_TOKEN;

  try {
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var json = JSON.parse(response.getContentText());

    if (json.error) {
      Logger.log('❌ Facebook API Error for form ' + formId + ': ' + JSON.stringify(json.error));
      return [];
    }

    return json.data || [];
  } catch (e) {
    Logger.log('❌ Fetch failed for form ' + formId + ': ' + e.message);
    return [];
  }
}

// ─── Build a sheet row from a lead object ────────────────────
function buildRow(lead, formId) {
  var fields = {};
  (lead.field_data || []).forEach(function (f) {
    // Normalize field names (facebook uses snake_case)
    var key = f.name.toLowerCase().replace(/\s+/g, '_');
    fields[key] = (f.values || [])[0] || '';
  });

  // Try various common field name patterns Facebook uses
  var name  = fields['full_name']      || fields['name']         || '';
  var email = fields['email']          || fields['email_address'] || '';
  var phone = fields['phone_number']   || fields['phone']         || fields['mobile_number'] || '';
  var city  = fields['city']           || fields['location']      || '';
  var service = fields['service_interest'] || fields['service']   || fields['what_service_are_you_interested_in'] || '';
  var message = fields['message']      || fields['your_message']  || fields['comments']      || '';

  var dateReceived = lead.created_time
    ? new Date(lead.created_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : '';

  return [
    lead.id          || '',       // Lead ID
    dateReceived,                 // Date Received (IST)
    name,                         // Full Name
    email,                        // Email
    phone,                        // Phone Number
    city,                         // City
    service,                      // Service Interest
    message,                      // Message
    'New',                        // Status (default)
    formId           || '',       // Form ID
    lead.ad_id       || '',       // Ad ID
    lead.ad_name     || '',       // Ad Name
  ];
}

// ─── Get or create the sheet tab ─────────────────────────────
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    Logger.log('📄 Created new sheet: ' + CONFIG.SHEET_NAME);
  }

  return sheet;
}

// ─── Write column headers if sheet is empty ──────────────────
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);

    // Style the header row
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground('#1a73e8');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);

    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);   // Lead ID
    sheet.setColumnWidth(2, 160);   // Date
    sheet.setColumnWidth(3, 160);   // Name
    sheet.setColumnWidth(4, 200);   // Email
    sheet.setColumnWidth(5, 130);   // Phone
    sheet.setColumnWidth(6, 120);   // City
    sheet.setColumnWidth(7, 180);   // Service
    sheet.setColumnWidth(8, 220);   // Message
    sheet.setColumnWidth(9, 100);   // Status
    sheet.setColumnWidth(10, 140);  // Form ID
    sheet.setColumnWidth(11, 140);  // Ad ID
    sheet.setColumnWidth(12, 160);  // Ad Name

    Logger.log('📋 Headers written');
  }
}

// ─── Get all existing Lead IDs to avoid duplicates ───────────
function getExistingLeadIds(sheet) {
  var lastRow = sheet.getLastRow();
  var ids = new Set();

  if (lastRow <= 1) return ids; // Only headers or empty

  var values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  values.forEach(function (row) {
    if (row[0]) ids.add(String(row[0]));
  });

  return ids;
}

// ─── Format the last appended row ────────────────────────────
function formatLastRow(sheet) {
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(lastRow, 1, 1, HEADERS.length);

  // Alternating row colors
  var bgColor = lastRow % 2 === 0 ? '#f8f9fa' : '#ffffff';
  range.setBackground(bgColor);

  // Color the Status cell (column 9) green for "New"
  sheet.getRange(lastRow, 9).setBackground('#e6f4ea').setFontColor('#137333');
}

// ─── Send an email summary when leads come in ────────────────
function sendSummaryEmail(count) {
  var email = Session.getActiveUser().getEmail();
  var subject = '🔔 ' + count + ' New Facebook Lead(s) — AKS Automations';
  var body = [
    'Hello,',
    '',
    count + ' new lead(s) have been synced from Facebook Lead Ads to your Google Sheet.',
    '',
    '👉 View Google Sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    '',
    '— AKS Automations Leads Bot',
  ].join('\n');

  MailApp.sendEmail(email, subject, body);
}

// ─── SETUP: Install a time-based trigger ─────────────────────
// Run this function ONCE manually to set up automatic sync every 15 minutes
function installTrigger() {
  // Remove existing triggers first to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'syncFacebookLeads') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Run syncFacebookLeads every 15 minutes
  ScriptApp.newTrigger('syncFacebookLeads')
    .timeBased()
    .everyMinutes(15)
    .create();

  Logger.log('⏰ Trigger installed: syncFacebookLeads runs every 15 minutes');
  SpreadsheetApp.getUi().alert('✅ Trigger installed! Leads will sync every 15 minutes automatically.');
}

// ─── UTILITY: List all your Lead Forms ───────────────────────
// Run this once to find your FORM_IDs — paste them into CONFIG above
function listFormIds() {
  // First get your Page ID
  var pageUrl = 'https://graph.facebook.com/' + CONFIG.API_VERSION +
    '/me/accounts?access_token=' + CONFIG.PAGE_ACCESS_TOKEN;

  var pageRes = UrlFetchApp.fetch(pageUrl, { muteHttpExceptions: true });
  var pages = JSON.parse(pageRes.getContentText());

  if (pages.error) {
    Logger.log('❌ Error fetching pages: ' + JSON.stringify(pages.error));
    return;
  }

  Logger.log('📄 Your Pages:');
  (pages.data || []).forEach(function (page) {
    Logger.log('  Page: ' + page.name + ' | ID: ' + page.id);

    // For each page, fetch its lead forms
    var formsUrl = 'https://graph.facebook.com/' + CONFIG.API_VERSION +
      '/' + page.id + '/leadgen_forms' +
      '?fields=id,name,status,leads_count' +
      '&access_token=' + page.access_token;

    var formsRes = UrlFetchApp.fetch(formsUrl, { muteHttpExceptions: true });
    var forms = JSON.parse(formsRes.getContentText());

    (forms.data || []).forEach(function (form) {
      Logger.log(
        '    📋 Form: "' + form.name + '"' +
        ' | ID: ' + form.id +
        ' | Status: ' + form.status +
        ' | Leads: ' + (form.leads_count || 0)
      );
    });
  });
}

// ─── UTILITY: Manual full sync (run from menu) ───────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🔄 Facebook Leads')
    .addItem('Sync Now', 'syncFacebookLeads')
    .addItem('Install Auto-Sync (15 min)', 'installTrigger')
    .addItem('List My Form IDs', 'listFormIds')
    .addSeparator()
    .addItem('Clear All Leads (Danger!)', 'clearAllLeads')
    .addToUi();
}

// ─── UTILITY: Clear all data rows (keep headers) ─────────────
function clearAllLeads() {
  var sheet = getOrCreateSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
    Logger.log('🗑️ Cleared all lead rows');
  }
}
