**Warning! This is a rarely used feature, normally you don't need it.**

Piler is able to sort emails to 'folders'. Nothing is actually changed, only piler keeps track of a folder id ↔ message serial id assignment for each messages.

To enable the folder feature, you should fix the piler configuration as follows. Note that these settings should be applied from the first day.

Edit piler.conf, and set

```
enable_folders=1
```

Edit config-site.php, and set

```
$config['ENABLE_FOLDER_RESTRICTIONS'] = 1;
```

Edit sphinx.conf, and add the following to the source base {} block

```
   sql_attr_uint = folder
```

Now whenever the piler daemon receives a message, it assigns the appropriate folder id. The list of folders can be seen in the “Folders menu” by administrators and auditors.

Administrators are able to create folder rules, ie. rules the piler daemon checks for, and if the message matches a folder rule (eg. put messages from gmail.com to folderA), then the regarding folder id is assigned to the message.

With pilerimport you may either set a specific folder id to archived messages (using the -F <foldername> option), or you may use -R (in case of imap imports) when pilerimport assigns the imap folder name as a folder name for the given message.
