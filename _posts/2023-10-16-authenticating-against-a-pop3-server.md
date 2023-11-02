The piler gui can authenticate users against a POP3 server. To do so, set the following:

```
$config['ENABLE_POP3_AUTH'] = 1;
$config['POP3_HOST'] = 'mail.yourdomain.com';
$config['POP3_PORT'] =  995;
$config['POP3_SSL'] = true;
```

That's all, the gui will forward authentication requests to the POP3 server. If you need auditor or additional admin users, then create them manually in the gui as local users.
