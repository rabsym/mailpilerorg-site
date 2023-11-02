### Users, groups, and rights

piler allows you to access only your emails you either sent or received. It's often required to grant permission to read emails of another users. Let's say Alice wants to see Bob's and Jim's emails. To do so create a group, type its name, then enter Alice's email address to the “Email addresses**” textarea. Finally type Bob's and Jim's email addresses to the “Assigned email addresses**”, and click on Add or Modify.

Thus when Alice logs in both Bob's and Jim's email addresses are added to her allowed to see email addresses, so Alice can read Bob's emails, and Jim's emails, and of course her own emails as well.

```
admin@local permissions
```

Sometimes it's not feasible if the built-in (or any) administrator has access to any email piler has archived. So the administrators can see only their own emails (and anything their membership allows). If you need a user who can access anyone's emails then grant him AUDITOR privileges on the user settings page.

Note that you need administrator privileges to see system statistics, edit user / group settings, policies, etc.

### Archiving(=exclusion) rules

You may define rules to prevent piler and pilerimport to archive certain messages, eg. having no subject, too big, recognized spam, etc.

You may specify the From:, To/Cc:, Subject:, message size, attachment type and size value. Piler uses the tre regex library to test whether the given rule matches the processed message. If so, then neither piler nor pilerimport will archive it, but rather discard it after logging.

Here are some examples:

| subject: ^ {0,}$ | no subject |
| size: > 1000000, attachment type: video/ | messages bigger than 1 MB + having a video attachment |
| size: < 500 | spam probes, not having any body |
| subject: \[SPAM\] | recognised spam emails |
| BUY( NOW){0,1} (viagra|cialis) | “buy” or “buy now” viagra/cialis spam |

You may test a single EML format message against your archiving rules by using pilertest, and it will print out the first matching archiving rule, eg.

```
pilertest message.eml

locale: hu_HU
message-id: <586387.60094.qm@web83907.mail.sp1.yahoo.com>
from: *Queen Oneil queenbaby3@att.net queenbaby3 att net (att.net )*
to: *undisclosed recipients ()*
reference: **
subject: **
sent: 1293679136
hdr len: 3007
body digest: 0230af406d0e03e56ed63eeb8e0891ed6a97f49d297f42c0d2565cb770311323
rules check: from=,to=,subject=^$,size0,att.type=,att.size0
attachments:
direction: 0
spam: 0
```

When piler starts it reads the archiving rules and compiles them at startup. So if you change the archiving rules, be sure to send a HUP signal to `cat /var/run/piler/piler.pid` to have piler re-read the rules.

### Retention rules

How long shall piler retain your messages? You may control it with the retention rules. The format is exactly the same as with the archiving rules: you can define the From:, To/Cc:, Subject:, message size, etc. and the retention period in days.

Every time piler archives a message, it assigns a retention period according to the retention rules or applying the default value (2257 days = 7 years + 2 days, unless you change it in piler.conf). After the retention period has expired the piler utilities will remove the message from the archive.

It's recommended to create your retention policy before deploying any archiving solution.

Note that the retention period is included in the per message verification digest, so the retention period should not be changed after the message has been archived.

Piler also compiles a list from the retention rules, so whenever you change them, be sure to send a HUP signal to piler.

### Auditing

To enable the audit feature, make sure $config['ENABLE_AUDIT'] = 1; is set. Then you may hit the “Search” button to see every action.

You may specify a date (YYYY.MM.DD), an action (login, loginfailed, logout, view, restore, download, search), an IP-address or a username containing @-symbol.

### Rotating sphinx index files

Over time your sphinx index files grow large, and then it takes much time to merge the delta index to the main1 index. The solution is simple: use another “main” index, eg. main2.

To do so replace “main1” with “main2” (without the quotes) in /usr/local/libexec/piler/indexer.*.sh scripts, then add main2 to the sphinx index in config-site.php:

```
$config['SPHINX_MAIN_INDEX'] = 'main1,main2,dailydelta1,delta1';
```

I recommend you to switch to a new main index (eg. main3, …) if the main spp or spd files exceed 1-2 GB.

### What to do with spam

It's a waste to archive junk messages, so the best solution is to prevent them entering the archive. This can be achieved by redirecting spam messages to a quarantine, so only good emails can get to the archive.

If this setup is not feasible, you may create an archiving rule that keeps spam emails out of the archive. Or you may create a retention rule that no spam is to be retained beyond 30 days. Unfortunately these may be error prone, think about a false positive error.

### How to localize piler?

Create the appropriate language directory under the language/ directory, eg.

```
cp -R language/en language/de
```

Then translate the language/de/messages.php file using UTF-8 encoding, and add it to config.php:

```
$langs = array(
              'hu',
              'en',
              'de'
             );
```

### How to make a custom skin to piler?

Copy the style-default.css file, then edit it, eg.

```
cp view/theme/default/stylesheet/style-default.css view/theme/default/stylesheet/style-my-new-look.css
```

Then add it to config.php:

```
$themes = array(
              'default',
              'my-new-look'
             );
```
