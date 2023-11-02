

The pilerexport utility lets you export messages from the archive to EML files to the current directory.

IMPORTANT! The pilerexport utility is setuid to the piler user, and to let it create the EML files you have to cd to a directory where the piler user has write access.

```
usage: pilerexport 

    [-c|--config <config file>] 
    -a|--start-date <YYYY.MM.DD> -b|--stop-date <YYYY.MM.DD> 
    -f|--from <email@address> -r|--to <email@address>
    -s|--minsize <number> -S|--maxsize <number>
    -A|--all  -d|--dryrun 

    use -A if you don't want to specify the start/stop time nor any from/to address
```

Note: if you use the GNU libc you may use the long option names, too.

If you want to see what messages piler would export, then use the -d (or -dryrun) commandline option. It will print a list of IDs associated with each messages.

To prevent you dumping the whole archive you have to specify the from addresses and/or the recipient addresses and/or the start/stop dates. If you really want to export the whole archive, then use the -A (or -all) commandline option. You may need lots of disk space to do so.

You may specify more email addresses, see the examples below.

The conditions are in Boolean AND relation with each other.

export all emails >10kB in last December:

```
pilerexport -s 10000 --start-date 2011.12.01 --stop-date 2011.12.31
```

export all emails if size is between 100k and 2MB _AND_ the sender is any of aaa@aaa.fu,bbb@aaa.fu,ccc@ccc.fu _AND_ the recipient is aaa@gmail.com:

```
pilerexport -s 100000 -S 2000000 -f aaa@aaa.fu -f bbb@aaa.fu -f ccc@ccc.fu -r aaa@gmail.com
```

do a daily backup to the current directory:

```
pilerexport --start-date 2012.01.11 --stop-date 2012.01.11
```
