## CUSTOM_EMAIL_QUERY_FUNCTION

Piler allows you to alter or fix the authentication, eg. add extra email addresses, etc. You may think about it as a post authentication hook.

The following example adds a 2nd domain name to your email addresses. Let's say you have two addresses user@domain.com, and alias@domain.com, and you want to read emails for user@otherdomain.com, and alias@otherdomain.com. Then add the following to config-site.php:

```
$config['CUSTOM_EMAIL_QUERY_FUNCTION'] = 'my_custom_func';

function my_custom_func($username = '') {
   $a = array($username);

   $s = explode("@", $username);
   array_push($a, $s[0] . "@otherdomain.com");

   return $a;
}
```

The next example assumes an IMAP server that expects only the username part without the domain (eg. @example.com). To fix the issue, we append @example.com to all non-@local accounts:

```
$config['CUSTOM_EMAIL_QUERY_FUNCTION'] = 'my_custom_func';

function my_custom_func($username = '') {

   if(!strstr($username, '@local')) {
      $email = $username . '@example.com';
      return array($email);
   }
}
```

The `CUSTOM_EMAIL_QUERY_FUNCTION` can also be used in ldap scenarios to restrict login to certain users. Preferable this is done with the base dn to restrict the ldap matching filter to only those accounts that should be able to login. But sometimes this is not enough - so setting ` $session->set("disabled", 1);` will disable login for the current session:

```
$config['CUSTOM_EMAIL_QUERY_FUNCTION'] = 'restrict_ldap';

function restrict_ldap($emails) {
  /**
  * Custom function to allow login to certain usernames only
  * @param mixed $emails  This can be either a string presenting a single username (local)
  *                       or an array with multiple string values (ldap)
  *
  * @return array of emails
  */
  $session = Registry::get('session');
  if (!is_array($emails)) {
    // local login
    $emails = array($emails);
    return $emails;
  }
  // ldap login:
  if((!in_array("user1@ldapdomain.com",$emails)) and (!in_array("user2@ldapdomain.com",$emails))) {
    // deny login
    $session->set("disabled", 1);
    return array();
  } else {
    return $emails; // return ldap emails
  }
}
```
Please note that for ldap logins `$emails` is an **array**, while for all other logins (local, imap, pop3, ...) this is a **string** containing the login email/username.

## CUSTOM_PRE_AUTH_FUNCTION

Piler also supports a pre authentication hook which runs before any authentication is performed.

Look at the below example. You define only IMAP_PORT and IMAP_SSL in config-site.php, and set the IMAP_SERVER based on the domain part of the username:

```
$config['CUSTOM_PRE_AUTH_FUNCTION'] = 'my_imap';

function my_imap($username = '') {
   global $session;

   if(strstr($username, "@domain1.com")) {
      define('IMAP_SERVER', 'imap.domain1.com');
   } else if(strstr($username, "@domain2.com")) {
      define('IMAP_SERVER', 'imap.domain2.com');
   } else {
      define('IMAP_SERVER', 'imap.somedomain.com');
   }
}
```

