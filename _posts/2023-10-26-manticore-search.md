
[Manticore search](https://manticoresearch.com/install/) is a drop-in replacement for sphinxsearch. Unfortunately the development of sphinxsearch has been stalling for quite a while, no bugfixes for quite sometimes, so piler starting from version 1.4.1 has switched to manticore search.

Note that sphinxsearch is still supported, and you may keep using it. If you decided to switch to manticore, unfortunately you need to reindex, because the index files are not compatible.

If you decided to use manticore, then be sure to run

```
touch /usr/local/etc/piler/MANTICORE
```

The piler shipped manticore config supports real-time index data. To enable it, set the following in /usr/local/etc/piler/manticore.conf:

```
define('RT', 1);
```

Also fix the following value in /usr/local/etc/piler/config-site.php:

```
$config['SPHINX_MAIN_INDEX'] = 'piler1';
```

Finally set the following in /usr/local/etc/piler/piler.conf:

```
rtindex=1
sphxdb=piler1
sphxhost=127.0.0.1
sphxport=9306
```
