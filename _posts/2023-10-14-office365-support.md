Prerequisite: you have an office 365 subscription.

### Create a mailbox for NDR reports

Login at [office 365 admin portal](https://portal.office.com/), then go to “Users” → “Active users” menu, and create a user for receiving undeliverable journal reports, eg. ndr-reports@yourdomain.com.

### Create a journaling rule

Go to Exchange admin center, then “compliance management”, and select “journal rules”.

Click right next to “Send undeliverable journal reports to:”, and specify the address you just created (ie. ndr-reports@yourdomain.com).

1. Enter “archiving@piler.yourdomain.com” to “Send journal reports to”
2. Type “archiving” to “Name”
3. Select “[Apply to all messages]” at “If the message is sent to or received from…”
4. Select “All messages” at “Journal the following messages…”
5. Finally click on “save”

Edit config-site.php, and setup IMAP authentication against office 365

```
$config['ENABLE_IMAP_AUTH'] = 1;
$config['IMAP_HOST'] = 'outlook.office365.com';
$config['IMAP_PORT'] =  993;
$config['IMAP_SSL'] = true;
```

Your users are able to login with their IMAP accounts to the piler gui.
