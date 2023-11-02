### Scenario: you want to migrate piler to a new node.

Let's call the old host “OLD”, and the new host “NEW”.

Prerequisite: NEW is up and running, and piler is installed on it.

**Make sure that piler.key on NEW is the same as on OLD, and if the 'iv' parameter is set on OLD in piler.conf, it must have the same value on NEW.**

- Stop piler, sphinx and mysql on NEW
- Disable the piler cron jobs on NEW
- Fix your mail server to send emails to NEW. Since piler is not running on NEW, it can't, so it starts to queue up the emails
- Stop piler on OLD
- Run delta indexer on OLD
- Disable piler cron jobs on OLD
- Stop sphinx on OLD
- Stop mysql on OLD
- Copy the mysql files (/var/lib/mysql/*) from OLD to NEW
- Copy the sphinx files (/var/piler/sphinx/*) from OLD to NEW
- Start mysql on NEW, and verify that the piler database is fine
- Start searchd on NEW, and verify that it works properly
- Start piler on NEW, and verify that new emails are archived properly
- Enable piler cron jobs on NEW, except purge.sh
- Copy /var/piler/store/* files from OLD to NEW
- Enable purge.sh on NEW in piler's cron jobs

While old emails will become available on NEW gradually, over time, it can archive new emails from the mail server.
