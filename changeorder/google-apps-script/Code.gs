/**
 * Deploy as Web app (Execute as: Me, Anyone can access). Form POSTs JSON here.
 * Sheet: https://docs.google.com/spreadsheets/d/1vm27zNqKeP0Ob7oZ3TafAYFzWmET3UkF4cQKRLsTLGs/edit
 *
 * First-time authorize: Google may show accounts.google.com/.../oauth/warning (“Google hasn’t
 * verified this app”). That is normal for Apps Script. Use Advanced → open your script / Allow.
 * Do not paste that warning URL into .env — after deploy, copy only the Web app URL ending in /exec.
 *
 * Optional Resend (overrides MailApp when set): Project Settings → Script properties
 *   RESEND_API_KEY, RESEND_FROM (e.g. Reverion <onboarding@resend.dev>), NOTIFY_EMAIL (to address)
 */
var SPREADSHEET_ID = '1vm27zNqKeP0Ob7oZ3TafAYFzWmET3UkF4cQKRLsTLGs';
var NOTIFY_EMAIL = 'reveriontech@gmail.com';

function doPost(e) {
  var raw = (e.postData && e.postData.contents) ? e.postData.contents : '{}';
  var data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'invalid_json' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('Sheet1') || ss.getSheets()[0];
  sheet.appendRow([
    data.coCode || '',
    data.date || '',
    data.client || '',
    data.authorizedPerson || '',
    data.taskDescription || '',
  ]);

  var co = data.coCode || '(no code)';
  var subject = 'Change order: ' + co + ' — ' + (data.client || 'Unknown client');
  var body =
    'A new change order was submitted.\n\n' +
    'CO code: ' + (data.coCode || '') + '\n' +
    'Date: ' + (data.date || '') + '\n' +
    'Client: ' + (data.client || '') + '\n' +
    'Authorized person: ' + (data.authorizedPerson || '') + '\n\n' +
    'Task description:\n' +
    (data.taskDescription || '') + '\n';

  var props = PropertiesService.getScriptProperties();
  var resendKey = props.getProperty('RESEND_API_KEY');
  var sent = false;
  if (resendKey) {
    try {
      var fromAddr = props.getProperty('RESEND_FROM') || 'onboarding@resend.dev';
      var toAddr = props.getProperty('NOTIFY_EMAIL') || NOTIFY_EMAIL;
      var res = UrlFetchApp.fetch('https://api.resend.com/emails', {
        method: 'post',
        contentType: 'application/json',
        muteHttpExceptions: true,
        headers: { Authorization: 'Bearer ' + resendKey },
        payload: JSON.stringify({
          from: fromAddr,
          to: [toAddr],
          subject: subject,
          text: body,
        }),
      });
      if (res.getResponseCode() < 300) {
        sent = true;
      } else {
        Logger.log('Resend HTTP ' + res.getResponseCode() + ': ' + res.getContentText());
      }
    } catch (resendErr) {
      Logger.log('Resend failed: ' + resendErr);
    }
  }
  if (!sent) {
    try {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: subject,
        body: body,
      });
    } catch (mailErr) {
      Logger.log('MailApp.sendEmail failed: ' + mailErr);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
