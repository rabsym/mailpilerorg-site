The STARTTLS SMTP extension enables a secure, encrypted channel between your mail server and piler. The feature is automatically compiled in.

### Create a PEM file

Create a PEM file containing both the private key and the certificate. If a self-signed certificate is good enough for you, then try the following:

```
openssl genrsa 2048 > /usr/local/etc/piler.pem
chmod 600 /usr/local/etc/piler.pem
openssl req -new -key /usr/local/etc/piler.pem > 1.csr
openssl x509 -in 1.csr -out 1.cert -days 3650 -req -signkey /usr/local/etc/piler.pem
cat 1.cert >> /usr/local/etc/piler.pem
```

Edit /usr/local/etc/piler.conf

```
tls_enable=1
pemfile=/usr/local/etc/piler.pem
```

Restart piler, and verify that it advertises the STARTTLS capability

```
telnet piler.yourdomain.com 25
Trying 1.2.3.4...
Connected to piler.yourdomain.com.
Escape character is '^]'.
220 piler.yourdomain.com ESMTP
EHLO aaa.fu
250-piler.yourdomain.com
250-PIPELINING
250-STARTTLS
250-SIZE
250 8BITMIME
```

