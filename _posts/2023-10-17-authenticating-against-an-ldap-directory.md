The piler gui can authenticate users against various LDAP directories.

Prerequisite: have an LDAP directory with all your users, distribution lists, etc.

### Generic steps: enable LDAP authentication, and create a helper account

The piler gui requires a (preferably read-only) LDAP account that can run ldap queries.

```
$config['ENABLE_LDAP_AUTH'] = 1;
$config['LDAP_HOST'] = 'your.ldap.host';
$config['LDAP_HELPER_DN'] = '..........';
$config['LDAP_HELPER_PASSWORD'] = 'xxxxxxx';

// set this if you want to limit the scope of the ldap query
$config['LDAP_BASE_DN'] = '';
```

For ldaps connections you should add the following to /etc/ldap/ldap.conf:

```
TLS_REQCERT never
```

### Settings for Zimbra

```
$config['ENABLE_LDAP_AUTH'] = 1;
$config['LDAP_HOST'] = 'zimbra.yourdomain.com';
$config['LDAP_MAIL_ATTR'] = 'mail';
$config['LDAP_ACCOUNT_OBJECTCLASS'] = 'zimbraAccount';
$config['LDAP_DISTRIBUTIONLIST_OBJECTCLASS'] = 'zimbraDistributionList';
$config['LDAP_DISTRIBUTIONLIST_ATTR'] = 'zimbraMailForwardingAddress';
$config['LDAP_HELPER_DN'] = 'uid=zimbra,cn=admins,cn=zimbra';
$config['LDAP_HELPER_PASSWORD'] = 'xxxxxxx';
```

That's all, the gui will forward authentication requests to the ldap server. If You need auditor or additional admin users, then create them manually in the gui.

### Settings for Lotus Domino

```
$config['LDAP_MAIL_ATTR'] = 'mail';
$config['LDAP_ACCOUNT_OBJECTCLASS'] = 'dominoPerson';
$config['LDAP_DISTRIBUTIONLIST_OBJECTCLASS'] = 'dominoGroup');
$config['LDAP_DISTRIBUTIONLIST_ATTR'] = 'mail';
$config['LDAP_HELPER_DN'] = '.........';
$config['LDAP_HELPER_PASSWORD'] = 'xxxxxxx';
```

### Settings for iredmail

```
$config['LDAP_MAIL_ATTR'] = 'mail';
$config['LDAP_ACCOUNT_OBJECTCLASS'] = 'mailUser';
$config['LDAP_BASE_DN'] = 'o=domains,dc=yourdomain,dc=com';
$config['LDAP_DISTRIBUTIONLIST_OBJECTCLASS'] = 'mailList';
$config['LDAP_DISTRIBUTIONLIST_ATTR'] = 'memberOfGroup';
$config['LDAP_HELPER_DN'] = 'cn=vmailadmin,dc=yourdomain,dc=com';
$config['LDAP_HELPER_PASSWORD'] = 'xxxxxxx';
```

Note that the gui grants regular user permissions for everyone authenticated successfully against ldap. If certain users need auditor rights, then create a group in ldap, and put the auditors to this group. Then set this value to LDAP_AUDITOR_MEMBER_DN in config-site.php:

```
// the value is case sensitive!
$config['LDAP_AUDITOR_MEMBER_DN'] = 'CN=PilerAuditors,CN=Users,DC=your,DC=domain,DC=com';
```

The same can be done with admin users, too:

```
// the value is case sensitive!
$config['LDAP_ADMIN_MEMBER_DN'] = 'CN=PilerAdmins,CN=Users,DC=your,DC=domain,DC=com';
```
