The piler gui can authenticate users against an IMAP server. To do so, set the following:

```
$config['ENABLE_IMAP_AUTH'] = 1;
$config['IMAP_HOST'] = 'mail.yourdomain.com';
$config['IMAP_PORT'] =  993;
$config['IMAP_SSL'] = true;
```

That's all, the gui will forward authentication requests to the IMAP server. If you need auditor or additional admin users, then create them manually in the gui as local users.

If your IMAP server expects only usernames and not complete email addresses as the login name, then you may use a custom authentication to fix it.
