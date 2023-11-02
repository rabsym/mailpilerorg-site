

This document refers to what data the piler archive collects. If you want to read the privacy policy of THIS SITE, then read [this link](/privacy-policy/) instead.

The piler archives emails which might contain sensitive data. The archive uses the following measures to protect your data:

- using TLS encryption during the smtp transaction if the smtp client supports it (set tls_enable=1 in piler.conf, and create piler.pem)
- the piler smtp daemon supports tcp_wrappers library to limit access to who can send emails to the archive
- pilerimport supports both pop3 and imap over TLS
- all stored emails are encrypted using a 256 bit long key using the AES algorithm (Note: 128 bit Blowfish for legacy emails)
- all emails are accessible for user piler only (not counting root privileged accounts)
- the piler daemons syslog the smtp client address, the recipients of the email, the smtp commands in the transaction, message-id of the email, number of attachments
- the textual content of the email is written to a mysql table first. This table is read and then emptied by the indexer utility writing a sphinx index database
- the GUI supports 2 factor authentication using the Google Authenticator application
- the GUI syslogs all login attempts
- the GUI writes an audit log for each user action, eg. user search for something, user viewed an email, etc. Such a log consist of the username, timestamp, IP-address and the performed action
- the GUI uses strict access control to limit users to see only their own emails (users with auditor roles are able to see any email)
- if the delete feature is turned on, then an auditor user may remove a message if it contains sensitive personal data
- if the purging feature is enabled, then the purging utility periodically removes aged messages from the archive
- the legal hold feature can be used to prevent removing a user's emails even if some of those emails are aged and marked for deletion
