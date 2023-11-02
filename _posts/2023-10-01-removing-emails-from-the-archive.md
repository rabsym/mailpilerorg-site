Occasionally it's required to remove some emails from the archive due to compliance or other reasons. To enable the removal feature set the following in config-site.php:

```
$config['ENABLE_DELETE'] = 1;
```

Then auditor users are allowed to mark emails for removal. Regular users or admins cannot do so. When an auditor selects a message for removal, he clicks on the delete icon in the middle bar of the screen to artificially set its retention value to the past. He also needs to specify a reason for the removal which will be stored in the mysql database for later reference for the action.

The selected messages will appear gray to visually indicate the mark for removal.

Then when the daily purge utility runs, it will remove the email physically from the archive. The purged email also needs to be cleared from the Sphinx database. It happens after the next main index merge.

