When piler archives a message, it assigns a retention value (=a timestamp) to it. Piler guarantees that the message will sit in the archive at least until its retention time expires.

The removal of aged emails is done by the pilerpurge.py utility. You must run pilerpurge.py if you want aged emails to be purged, otherwise they will be in the archive for eternity. So if you don't want emails to be purged, then simply don't run pilerpurge.py.

If you run pilerpurge.py periodically (eg. from crontab), then it first checks whether purging is allowed. If not, then it stops, otherwise it queries the ids of aged messages, then removes them from the disk, and sets their status as deleted in the metadata table.

Note that to preserve the history of emails, the metadata entries are not deleted.

In case of an ongoing audit or similar event you may disable the periodic purge. It can be done by administrators on the gui health page.

Before deploying piler (or any email archiving solution) make sure to have a well established retention policy. If may be as simple as to set the default retention to 7 years or so. It depends on region, industrial sector, legislation environment, etc.

pilerpurge.py has a dry-run mode when it doesn't remove anything, rather it only prints what it would remove.

To run pilerpurge.py in dry-run mode, specify the '-d' command line option

```
pilerpurge.py -d
```

If you want to purge all aged emails then simply run the pilerpurge utility, and it will remove all aged emails.

```
pilerpurge.py
```

### Important!

If you delete a message with pilerpurge.py, then it's removed from the /var/piler/store directory. However, the sphinx index is not touched, and after the removal you may still see the message in the search hits.

This is where the sphinx killlist feature comes in. It instructs sphinx to discard or suppress the removed email from the results. Note that this suppression might be delayed until the next time the delta indexer runs, ie. 30 mins.

So rebuilding the sphinx indices is not necessary just to eliminate the removed messaged from the search hits. However, if you have lots of aged messages, and you want to reduce the size of the sphinx index, then it might be a good a idea to reindex. If you decide to do so, be sure to backup the current sphinx data, ie. the /var/piler/sphinx directory.
