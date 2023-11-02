

Debian and Ubuntu users please see the [FAQ](/faq.html) to avoid a common pitfall, and fix /etc/default/sphinxsearch before start using sphinx.

Before installing piler you need to install the following packages (including the -dev or -devel packages as well):

Mandatory:

- openssl
- MySQL 5.5+, MariaDB or Percona
- manticore 6.x (Sphinx 2.2.x and 3.x are still supported)
- php 8.x (with the following modules: LDAP, GD, Memcache, PDO, MySQL, CURL, Zip) (PHP 7.x is still supported)
- a rewriting rule capable webserver, eg. apache, lighttpd, nginx, … (in case of apache be sure to enable the rewrite module)
- TRE regex library 0.8.x
- libzip
- mpstat utility (eg. the 'sysstat' package on Debian Linux)
- python3 with mysqldb support (python3-mysqldb package on debian/ubuntu)

Highly recommended:

- catdoc
- pdftotext
- unrtf
- tnef
- xlhtml (with sj mods)
- memcached
- PHP Memcache

Optional:

- xcache
- clamav
- libpst

## Preinstall tasks, recommendations

Before you install you must create a DNS entry for piler. It must have a valid and resolvable hostname. In this guide we'll use piler.yourdomain.com as the FQDN of the archive.

Since piler archives your emails it may need lots of disk space. To keep things tidy, I recommend you to put all piler related data (including your log files) under the /var (or /var/piler) partition. I recommend using logical volumes.

An example layout you may create:

```
/     - 2 GB
/tmp  - 256 MB
/var  - several hundreds of GBs (or even more)
swap  - 1 GB
```

The used filesystem is not a concern, however if you choose XFS, then be aware of a 32 bit vs. 1 TB issue.

Note that piler stores all emails and attachments as separate files. You may tweak inode ratio, if necessary.

See [https://bitbucket.org/jsuto/piler/issues/961/archive-size-mismatch](https://bitbucket.org/jsuto/piler/issues/961/archive-size-mismatch) for some additional hints.

Create a dedicated and non-privileged user to run piler

```
groupadd piler
useradd -g piler -m -s /bin/bash -d /var/piler piler
usermod -L piler
chmod 755 /var/piler
```

Unpack and compile piler

```
tar zxvf piler-x.y.z.tar.gz
cd piler-x.y.z
./configure --localstatedir=/var --with-database=mysql
make
su -c 'make install'
ldconfig
```

Make sure your system looks in /usr/local/lib for shared libraries! If not, then add this path to /etc/ld.so.conf.d/piler.conf.

Note: If you use [Percona version](http://www.percona.com/software/percona-server/) of mysql, you may switch to the XtraDB engine. To do this, execute the following command before creating the tables:

```
sed -i 's/InnoDB/XtraDB/g' util/db-mysql.sql
```

## Post install tasks

After a fresh install (ie. when it's not an upgrade) a few post install tasks must be done. Execute the post install script as root. It leads you through a series of questions, and eventually executes a set of commands to create SQL tables, cron jobs, populate the virtualhost directory, etc. If you want to perform the post install tasks manually, then checkout the manual post install.

Important! The 'hostid' parameter in piler.conf should be the hostname of piler, what is configured on your mailserver at always_bcc (see below). Eg. if you set archive@piler.yourdomain.com on your mailserver, then set hostid=piler.yourdomain.com in piler.conf

```
$ su
# make postinstall
```

Start both searchd and piler:

```
/etc/init.d/rc.piler start
/etc/init.d/rc.searchd start
```

Notes for Ubuntu users: make sure to remove /etc/cron.d/sphinxsearch as it interferes with the piler indices.

Configure your mail server to forward a copy of each email it receives or sends to piler

To archive emails, piler must receive them somehow. So you have to configure your mail server to send a copy of each received emails to piler via smtp. Since piler is actually an SMTP server, you should not put postfix, exim, … on the archive itself. If you need it for some reason, then put it to 127.0.0.1:25/tcp, and set the listen_addr variable in piler.conf to listen on eth0 or similar.

If you have MS Exchange, then turn on journaling.

If you have postfix (including zimbra), then add the following to main.cf:

/etc/postfix/main.cf:

```
   smtpd_recipient_restrictions = reject_non_fqdn_recipient, ..., \
                     check_recipient_access pcre:$config_directory/x-add-envelope-to, ...

   always_bcc = archive@piler.yourdomain.com
```

/etc/postfix/x-add-envelope-to:

```
   /(.*)/   prepend X-Envelope-To: $1
```

Note that such configuration might reveal Bcc addresses to the recipients in the To/Cc fields. To prevent it happening piler features the HEADER_LINE_TO_HIDE config.php variable to automatically hide the X-Envelope-To: line.

When set (and the default is as seen below) it will hide such header lines from regular users on the GUI, only auditors are allowed to see all recipients, including the Bcc addresses.

```
$config['HEADER_LINE_TO_HIDE'] = 'X-Envelope-To:';
```

If you have Exim, then add the following at the beginning of the routers-section:

```
begin routers

mailarchive:
  debug_print = "R: mailarchive for $local_part@$domain"
  driver = manualroute
  domains = *
  transport = remote_smtp
  # piler listening on port 25:
  route_list = * "piler.yourdomain.com::25"
  self = send

  unseen
```

IMPORTANT! Make sure you never lose/overwrite the key otherwise you won't access your archive ever again. So whenever you upgrade be sure to keep your existing key file. Also NEVER change the iv parameter in piler.conf after installation. The piler mysql database contains essential information, including metadata, permissions, tags, etc. If you lost the piler database, your archive would stop working! So you must take a good care of the piler database.

## Website postinstall tasks

This task depends greatly on what webserver you use. Basically you have to create a virtualhost dedicated to piler, and enable rewriting rules. The piler GUI expects to be in the DocumentRoot not in a subdirectory. Example webserver configurations are available in the contrib/webserver/ directory.

Log in as administrator using the following account:

```
admin@local:pilerrocks
```

Then add your own domains that piler will receive emails for in the Administration/Domain menu.

Centos / Redhat users should fix /etc/sudoers to have the following entries:

```
Defaults requiretty

Defaults:%apache !requiretty
```

## What next?

Be sure to review Administering piler / Retention rules, and set the appropriate retention rules, if needed. Otherwise piler will retain everything for 'default_retention_days'. Also go to Administration / Domains in the GUI, and add all your hosted domains.
