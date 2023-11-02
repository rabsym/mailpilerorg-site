To make piler to work with Google Apps Free Edition, follow these additional steps.

Prerequisite: have a working web interface of piler

### Register with Google

Visit the [Google API console](https://code.google.com/apis/console), and register a “Client ID for web applications”. You have to set the “Redirect URIs”, and the “JavaScript origins” fields, and you are free to customise it, eg. adding your logo.

```
Redirect URIs: http://piler.yourdomain.com/google.php
JavaScript origins: http://piler.yourdomain.com/
```

### Configure the web interface

Open config-site.php, and enable Google Apps support:

```
$config['ENABLE_GOOGLE_LOGIN'] = 1;
```
Also, set the following definitions (ie. replace the xxxxx…x characters) with the generated values on the API console:

```
$config['GOOGLE_CLIENT_ID'] = 'xxxxxxxxxxx';
$config['GOOGLE_CLIENT_SECRET'] = 'xxxxxxxxxxxxx';
$config['GOOGLE_DEVELOPER_KEY'] = 'xxxxxxxxxxxx';
```

### Using the first time

Now have your users to visit your piler installation at http://piler.yourdomain.com/.

They will find a link saying “Login via Google account”. Click on the link, enter your google account info to _Google_, then a notification is shown that “piler is requesting permission to …”. Let them accept it. Then they are redirected back to your site.


### Add cron entries

The first time they won't see anything, since piler just got access to their emails. To enable the polling via IMAP, set the following crontab entry for user piler:

```
1 * * * * (cd /var/www/piler.yourdomain.com; php /usr/local/libexec/piler/gmail-imap-import.php --webui .)
```

The cron job above will download emails to /var/piler/imap. The results are syslogged to maillog. Now we need another job to process these emails:

```
45 * * * * /usr/local/bin/pilerimport -d /var/piler/imap -r -q
```

This will import the downloaded emails to piler, then remove them. The importer script remembers the id of the last downloaded message, so it won't download from the first message when it runs again.

### Additional notes

If you have several GBs of email in Google Apps Free Edition, then it takes time to download them all, so don't enable the cronjobs until the first run of the imap importing is done.

You can track the progress by viewing the google_imap table where piler puts helper beacons. It's sufficient to keep the freshest few hundreds or so per email addresses.
