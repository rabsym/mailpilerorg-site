If you have a windows network with Active Directory, then it's possible to login with single sign-on. It means that your browser negotiates your authentication credentials with the server running piler in the background.

### Prerequisites

Make sure your clock is accurate, if necessary use ntpdate or other methods.

Verify /etc/resolv.conf settings to make sure your name resolution works properly. You may use the domain controllers as resolver dns servers.

Make sure /etc/samba/smb.conf is configured properly

```
[global]

workgroup = YOURDOMAIN
realm = YOURDOMAIN.YOURREALM
security = ADS
```

### How to setup on Debian / Ubuntu

Install mod_auth_ntlm_winbind

```
apt-get install libapache2-mod-auth-ntlm-winbind samba
cd /etc/apache2/mods-enabled
ln -sf ../mods-available/auth_ntlm_winbind.load 
```

Restart winbind

```
/etc/init.d/winbind restart
```

Add the www-data user to the winbindd_priv group:

```
usermod -G winbindd_priv www-data
```

uid=33(www-data) gid=33(www-data) groups=33(www-data),125(winbindd_priv)

Restart apache

```
apache2ctl restart
```

Note: With Samba 4, you need the following symlink:

```
ln -s /var/lib/samba/winbindd_privileged/pipe /var/run/samba/winbindd_privileged/pipe
```

### How to setup on Centos 7

```
yum install -y mod_auth_ntlm_winbind samba-winbind samba-winbind-clients samba-client

usermod -G wbpriv apache

setsebool -P allow_httpd_mod_auth_ntlm_winbind on
setsebool -P httpd_can_network_connect on

start winbind service

systemctl start winbind
```

### Join to the domain

```
net ads join -U Administrator
```

Check the status with

```
net ads info
net ads lookup
```

and

```
wbinfo -g
wbinfo -u
```

restart apache

```
apachectl restart
```

### Other steps

Create a helper account in AD. It will help piler to query user data when someone logs in.

Enable NTLM negotiation within the browser, and add the piler website

Firefox:

```
about:config
network.automatic-ntlm-auth.trusted-uris
```

Internet Explorer:


```
Tools
Internet Options
Security
Local Intranet
Sites
```

Last step: set the following in config-site.php:

```
$config['ENABLE_SSO_LOGIN'] = 1;
$config['LDAP_HOST'] = 'adserver.yourdomain.com';
$config['LDAP_HELPER_DN'] = 'CN=.....,DC=yourdomain,DC=com';
$config['LDAP_HELPER_PASSWORD'] = 'xxxxxxxx';
$config['LDAP_MAIL_ATTR'] = 'mail';
$config['LDAP_BASE_DN'] = 'dc=yourdomain,dc=com';

$config['REWRITE_MESSAGE_ID'] = 1;
```

Then whenever your users visit http://piler.yourdomain.com/, then they are redirected to sso.php, and logged in automatically, then redirected to the search page.

With SSO enabled, users in the local database, eg. admin@local, should go to http://piler.yourdomain.com/login.php

If anything goes wrong, then be sure to set “LogLevel debug” in apache to see what's going on.
