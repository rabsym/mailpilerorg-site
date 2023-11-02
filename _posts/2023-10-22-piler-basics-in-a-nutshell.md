The piler email archiver uses the following components:

- mysql: piler stores crucial metadata of the messages
- manticore (or sphinx): a search engine used by the gui to return the search results
- file system: this is where the encrypted and compressed messages, attachments are stored

How do emails get to the archive? You configure your email server to pass a copy of emails to the piler daemon via smtp, since piler is an SMTP(-talking) daemon. Note that you don't need to create any system or virtual users or email addresses for the piler daemon to work, because it simply archives every email it receives.

When an email is received, then it's parsed, disassembled, compressed, encrypted, and finally stored in the file system: one file for every email and attachment. Also, the textual data is written to the sph_index table. The periodic indexer job reads the sph_index table, and updates the sphinx databases.

The GUI uses sphinx and mysql database to return the search results to the users.

Piler has a built-in access control to prevent a user to access other's messages. Auditors can see every archived email. Piler parses the header and extracts the From:, To: and Cc: addresses (in case of From: it only stores the first email address, since some spammers include tons of addresses in the From: field), and when a user searches for his emails then piler tries to match his email addresses against the email addresses in the messages. To sum it up, a regular user can see only the emails he sent or received.

This leads to a limitation: piler will hide an email from a user if he was (only) in the Bcc: field. This limitation has another side effect related to external mailing lists. You have to maintain which user belongs to which external mailing lists, otherwise users won't see these messages. Internal mailing lists are not a problem as long as piler can extract the membership information from openldap OR Active Directory.

Fortunately both Exchange and postfix (and probably some other MTAs, too) are able to put envelope recipients to the email, so the limitation mentioned above is solved.
