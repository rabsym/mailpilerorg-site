

This page gives a detailed, step by step instructions how to do the upgrade with less pain.

## Generic notes

It's strongly recommended to backup your configs including piler.key, piler.conf, piler.pem, sphinx.conf and config-site.php before the upgrade.

If you upgrade from older releases then you should apply all the intermediate changes, ie. when upgrading from 0.1.18 to 0.1.20 please apply both db-upgrade-0.18-vs-0.19.sql and db-upgrade-0.19-vs-0.20.sql sql scripts.

## Upgrading the GUI

To upgrade the GUI just overwrite everything with webui/*. It won't touch your local configuration in config-site.php.

## from 0.1.18 to 0.1.19

Execute the following sql script on the piler database:

```
mysql -u piler -p piler < util/db-upgrade-0.18-vs-0.19.sql
```

Add the following variables to config.php:

```
define('TABLE_GROUP', 'group');
define('TABLE_GROUP_USER', 'group_user');
define('TABLE_GROUP_EMAIL', 'group_email');
```

## from 0.1.19 to 0.1.20

Execute the following sql script on the piler database:

```
mysql -u piler -p piler < util/db-upgrade-0.19-vs-0.20.sql
```

## from 0.1.20 to 0.1.21

Add the following variables to config.php:

```
define('ENABLE_FOLDER_RESTRICTIONS', 0);
define('ICON_NOTES', '/view/theme/default/images/notes.png');
define('ICON_PLUS', '/view/theme/default/images/plus.gif');
define('ICON_MINUS', '/view/theme/default/images/minus.gif');
define('ICON_EMPTY', '/view/theme/default/images/1x1.gif');
define('TABLE_FOLDER', 'folder');
define('TABLE_FOLDER_USER', 'folder_user');
define('TABLE_FOLDER_EXTRA', 'folder_extra');
define('TABLE_FOLDER_MESSAGE', 'folder_message');
define('TABLE_NOTE', '`note`');
define('SPHINX_NOTE_INDEX', 'note1');
define('LOAD_SAVED_SEARCH_URL', SITE_URL . 'index.php?route=search/load');
define('MESSAGE_NOTE_URL', SITE_URL . 'index.php?route=message/note');
```

Execute the following sql script on the piler database:

NOTE: before running the script, you should backup the 'tag' and 'note' tables then drop them, since the new version has a modified scheme for these tables.

```
mysql -u piler -p piler < util/db-upgrade-0.20-vs-0.21.sql
```

NOTE: the built-in admin@local account cannot see the users' emails any more. Instead the auditor role gives you the permissions to search in any mailbox. See administering piler for more.

## from 0.1.21 to 0.1.22

Execute the following sql script on the piler database:

```
mysql -u piler -p piler < util/db-upgrade-0.21-vs-0.22.sql
```

Rename LANG to DEFAULT_LANG in config.php:

```
-define('LANG', 'en');
+define('DEFAULT_LANG', 'en');

+define('DECRYPT_ATTACHMENT_BINARY', '/usr/local/bin/pileraget');
+define('ACTION_DOWNLOAD_ATTACHMENT', 15);
+define('ACTION_UNAUTHORIZED_DOWNLOAD_ATTACHMENT', 16);
+define('SEARCH_RESULT_CHECKBOX_CHECKED', 1);
+define('REWRITE_MESSAGE_ID', 0);
+define('ENABLE_SYSLOG', 0);
+define('RESTRICTED_AUDITOR', 0);
```

Stop searchd, then initialize the new index called note1, and finally start searchd again:

```
# /etc/init.d/rc.search stop
# su - piler
$ indexer note1
$ exit
# /etc/init.d/rc.search start
```

If you upgraded sphinx.conf as well, then be sure to _remove_ the following lines from sphinx.conf:

```
sql_attr_uint = folder
```

and remove the 'folder' column from the sql queries in the 'main' and 'delta' sources.

## from 0.1.22 to 0.1.23

Execute the following sql script on the piler database:

```
mysql -u piler -p piler < util/db-upgrade-0.1.22-vs-0.1.23.sql
```

Rename config.php to config-old.php, then copy the default config.php over your config.php. From now on, the variables are in an array with their default values. If you want to override any variable, then place it to config-site.php with the new value, eg.

```
$config['SITE_NAME'] = 'archive.example.com';
```

An example config-site.php

To support new versions of piler, you MUST relocate your store directory one level down:

Old store directory (for build ⇐ 765):

```
$localstatedir/piler/store/
```

New store directory (from build >= 767):

```
$localstatedir/piler/store/<SERVER_ID>
```

By default server_id is 0 which translates to SERVER_ID: “00”. if you set server_id=14 in piler.conf, then it translates to SERVER_ID: “0e”. If you have a single piler node, then leave the default (0). The following example assumes this scenario.

Create the server_id top level store directory:

```
/etc/init.d/rc.piler stop
```

# download, compile, and upgrade the new version

```
cd /var/piler/store
mkdir aaa
mv * aaa
mkdir 00
chown piler:piler 00
mv aaa/* 00
rmdir aaa
/etc/init.d/rc.piler start
```

## from 0.1.23 to 0.1.24

Execute the following sql script on the piler database:

```
mysql -u piler -p piler < util/db-upgrade-0.1.23-vs-0.1.24.sql
```

Important! The index scheme has changed from a delta - main scheme to a delta-delta - delta - main scheme. However you DON'T HAVE TO change sphinx config nor the indexer related cron jobs, it just works fine. In this case copy your current $config['SPHINX_MAIN_INDEX'] setting to config-site.php.

If you want to upgrade the sphinx scheme, then do the following:

Stop searchd:

```
/etc/init.d/rc.searchd stop
```

comment out the current indexer cron job:

```
####*/15 * * * * /usr/local/bin/indexer --quiet delta1 --rotate && sleep 2 && /usr/local/bin/indexer --quiet --merge main1 delta1 --merge-dst-range deleted 0 0 --rotate
```

su to user piler, then execute the following (make sure the cron job indexer won't interfere):

```
indexer delta1
indexer --merge main1 delta1 --merge-dst-range deleted 0 0
```

Overwrite sphinx.conf with the shipped version in piler-0.1.24/etc/sphinx.conf (make sure you have the proper username, password in the “source base” section.

Initialize the new index (as user piler):

```
indexer dailydelta
```

Add the new indexer cron jobs:

```
5,35 * * * * /usr/local/libexec/piler/indexer.delta.sh
30   2 * * * /usr/local/libexec/piler/indexer.main.sh
```

Start searchd:

```
/etc/init.d/rc.searchd start
```

## from 0.1.24 to 1.1.0

Execute the following sql script on the piler database:

```
mysql -u piler -p piler < util/db-upgrade-0.1.24-vs-1.1.0.sql
```

## from 1.1.1 to 1.2.0

There're some minor incompatibilities from 1.1.x to 1.2.0 you must be aware of. Be sure to read RELEASE_NOTES file in the source directory describing the changes.

The most important change is that I've moved all piler related configs to ${sysconfdir}/piler directory (with the default options it's /usr/local/etc/piler).

It means that whatever (piler related stuff) you had in /usr/local/etc, that must be moved to /usr/local/etc/piler, eg. /usr/local/etc/piler.conf → /usr/local/etc/piler/piler.conf, etc.

I've decided to put the sphinx config file to ${sysconfdir}/piler. Debian and Ubuntu ship a sphinx package which enabled a periodic indexer –all cron job, which practically destroys the sphinx indices, and despite both the install docs and the FAQ warn about it, many piler users fell for this debian 'trick'.

To match the new path, I've updated the rc.searchd file, and the indexer shell scripts as well.

Execute the following sql script on the piler database:

```
mysql -u piler -p piler < util/db-upgrade-1.1.0-vs-1.2.0.sql
```

I recommend you to run pilerconf after the upgrade, and check if you get the values in piler.conf back. If so, then the config files are at the proper new location.

## from 1.2.0 to 1.3.0

Nothing extra is required.

## from 1.3.0 to 1.3.5

The default mysql encoding has been changed from utf8 to utf8mb4. In mysql's terms 'utf8' is only a subset of the 4 byte range of the UTF-8 encoding. To provide full UTF-8 support mysql offers utf8mb4 encoding which is the default starting from 1.3.2. For new installations I recommend you to use the default (utf8mb4).

When upgrading you may either convert your database and tables to utf8mb4 (see the discussion at [https://bitbucket.org/jsuto/piler/issues/709/mysql_stmt_execute-error-incorrect-string](https://bitbucket.org/jsuto/piler/issues/709/mysql_stmt_execute-error-incorrect-string) and/or google the exact steps), or keep the current mysql settings.

In the latter case be sure to set the following values:

piler.conf:

```
mysqlcharset=utf8
```

config-site.php:

```
$config['DB_CHARSET'] = 'utf8';
```

sphinx.conf (for all sql_query_pre settings!):

```
sql_query_pre = SET NAMES utf8
```

Perform the following sql statements:

```
alter table sph_index change column `from` `from` tinyblob default null;
alter table metadata change column `from` `from` varchar(255) not null;
alter table metadata change column `fromdomain` `fromdomain` varchar(255) not null;
alter table metadata change column `message_id` `message_id` varchar(255) not null;
alter table attachment change column `name` `name` tinyblob default null;
alter table sph_index change column `body` `body` mediumblob default null;
alter table sph_index change column `subject` `subject` blob default null;
```

And add the following jobs to piler's crontab:

```
*/5 * * * * /usr/bin/find /var/piler/error -type f|wc -l > /var/piler/stat/error
3 * * * * /usr/local/libexec/piler/watch_sphinx_main_index.sh
```

