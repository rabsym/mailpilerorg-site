Piler supports clamd to scan for viruses in incoming emails. Whenever a virus is found, then it's dropped and piler syslogs the event. If you need clamd support then recompile piler with –-enable-clamd, and set the clamd_socket parameter in piler.conf.

Piler itself doesn't have any antispam features, however if you use any antispam application, set the spam_header_line parameter in piler.conf, then piler can recognize when it receives a spam. If you use SpamAssassin, then you may use the following:

```
spam_header_line=X-Spam-Flag: YES
```

However for performance reasons it's better if you filter for both viruses and spam on your MX servers, and forward only clean messages to piler.
