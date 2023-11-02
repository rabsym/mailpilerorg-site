Piler allows you to alter or fix the authentication, eg. add extra email addresses, etc. You may think about it as a post authentication hook.

The following example adds a 2nd domain name to your email addresses. Let's say you have two addresses user@domain.com, and alias@domain.com, and you want to read emails for user@otherdomain.com, and alias@otherdomain.com. Then add the following to config-site.php:

```
$config['CUSTOM_EMAIL_QUERY_FUNCTION'] = 'my_custom_func';

function my_custom_func($username = '') {
   $session = Registry::get('session');
   $data = $session->get("auth_data");

   $a = array();

   foreach($data['emails'] as $email) {
      $s = explode("@", $email);
      array_push($a, $s[0] . "@otherdomain.com");
   }

   $data['emails'] = array_merge($data['emails'] , $a);

   $session->set("auth_data", $data);
}
```

The next example assumes an IMAP server that expects only the username part without the domain (eg. @example.com). To fix the issue, we append @example.com to all non-@local accounts:

```
$config['CUSTOM_EMAIL_QUERY_FUNCTION'] = 'my_custom_func';

function my_custom_func($username = '') {
   $session = Registry::get('session');
   $data = $session->get("auth_data");

   if(!strstr($username, '@local')) {
      $email = $username . '@example.com';
      $data['emails'] = [$email];
      $session->set("auth_data", $data);
   }
}
```

If you want to change some aspects of the gui before the authentication takes place, then write a similar function. The following example would allow logins from a certain domain only, and reject others:

```
$config['CUSTOM_EMAIL_QUERY_FUNCTION'] = 'iii';

function iii($username = '') {
   global $session;

   if(!strstr($username, "@domain.com")) {
      $session->set("auth_data", array());
   }
}
```

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

