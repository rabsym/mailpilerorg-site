Piler archives lots of data, thus requiring huge disk space. Sometimes it may be better to put these data on an NFS or iSCSI mount. This document describes such a configuration.

In the following example we put the store directory to an NFS mount, everything else remains on the email archiving host:

```
/var/piler/sphinx
/var/piler/stat
/var/piler/store ==> NFS server
/var/piler/tmp
```

### Steps on the NFS server

#1 Create the piler group and user with the very same gid and uid as on the archiving host:

```
groupadd -g 1234 piler
useradd -g piler -u 1234 .... piler
```

#2 Add the following share on the NFS server (/etc/exports)

```
/data emailarchive.yourdomain.com(rw,sync,no_subtree_check,no_all_squash)
```

#3 Reload the exports:

```
exportfs -arv
```

#4 Create the top level store direcory on the NFS share:

```
mkdir /data/00
chown piler:piler /data/00
```

### Steps on the archiving host

#5 Stop piler on the archiving host, and make sure there's nothing in the store directory:

```
/etc/init.d/rc.piler stop
rm -rf /var/piler/store/*
```

#6 Mount the NFS share on the archiving host:

```
mount nfs-server.yourdomain.com:/data /var/piler/store -o soft,timeo=10,retrans=3,vers=3,proto=tcp
```

Or you may put it to /etc/fstab:

```
nfs-server.yourdomain.com:/data /var/piler/store nfs soft,vers=3,timeo=10,retrans=3    0    2
```

#7 Finally start piler:

```
/etc/init.d/rc.piler start
```

Additional notes

It's important to tune the timeo and retrans parameters that

```
timeo * retrans < mail server's timeout value
```

to handle the outage of the NFS server properly. retrans=3 and timeo=10 give the NFS server a ~30-35 second window until piler declares a failure, and returns a 451 error code to the mail server. So it's important that the mail server mustn't give up before piler has the chance to respond with a proper error code.

Also make sure to monitor the availability of the NFS share.
