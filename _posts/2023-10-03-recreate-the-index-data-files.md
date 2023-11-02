### Warning!

This is a troubleshooting task, use it only when you have to or you are advised to rebuild the sphinx index from scratch.

Piler relies heavily on the sphinx index data. The reindex utility is for healing it if anything goes wrong.

The reindex utility reads data from the metadata table, then retrieves the files from the /var/piler/store directory. Then it parses them again, and puts data to be indexed to the sph_index table, so the sphinx indexer utility can reindex these messages.

Note: If you reindexed all emails, then all of them would appear in the sph_index table, and might making it large on the disk. One way to mitigate it is to let the delta indexer run from cron, or another is that you set innodb_file_per_table, otherwise all data might end up in ibdata1 file which is difficult to shrink.

Usage:

```
reindex -f <from id> -t <to id> -a [-p]

-f: start from index

-t: end with index

-a: reindex all records

-p: display processed/all records counters
```

So the following command will get all messages with metadata table id between 1 and 1000.

```
reindex -f 1 -t 1000
```

Reindex all records:

```
reindex -a
```

If you need to reindex lots of email then I recommend you to disable the cron entries for the indexer process and run the following commands manually:

```
/usr/local/libexec/piler/indexer.delta.sh
/usr/local/libexec/piler/indexer.main.sh
```

When you are done enable the cron entries again.

Before running reindex, please change to a directory where the piler user has read and write permissions.
