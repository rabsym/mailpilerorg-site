Use the pilerimport utility to import an EML message file, messages from an mbox file or emails from a directory containing EML format messages (1 message per file).

```
usage: pilerimport

    [-c <config file>]                Config file to use if not the default
    -e <eml file>                     EML file to import
    -m <mailbox file>                 Mbox file to import
    -d <dir>                          Directory with EML files to import
    -i <imap server>                  IMAP server to connect
    -K <pop3 server>                  POP3 server to connect
    -u <username>                     Username for imap/pop3 import
    -p <password>                     Password for imap/pop3 import
    -P <port>                         Port for imap/pop3 import (default: 143/110
    -t <timeout>                      Timeout in sec for imap/pop3 import
    -x <folder1,folder2,....folderN,> Comma separated list of imap folders to skip. Add the trailing comma!
    -f <imap folder>                  IMAP folder name to import
    -g <imap folder>                  Move email after import to this IMAP folder
    -F <folder>                       Piler folder name to assign to this import
    -R                                Assign IMAP folder names as Piler folder names
    -b <batch limit>                  Import only this many emails
    -s <start position>               Start importing POP3 emails from this position
    -D                                Dry-run, do not import anything
    -o                                Only download emails for POP3/IMAP import
    -r                                Remove imported emails
    -q                                Quiet mode
```

IMPORTANT! The pilerimport utility is setuid to the piler user, and to let it create some temporary files you have to cd to a directory where the piler user has write access.

Import a single EML file:

```
pilerimport -e message-from-jack.eml
```

Import a single EML file from STDIN:

```
pilerimport -e -
```

Import all messages from an mbox file:

```
pilerimport -m ~sj/201112.mbox
```

Import all messages from a directory having EML messages:

```
pilerimport -d ~/Maildir/new
```

Import messages from an IMAP server:

```
pilerimport -i <imap server> -u <username> -p  <password> [-x comma,separated,skiplist]
```

By default pilerimport will skip the Junk, Trash, Spam and Draft folders (= -x junk,trash,spam,draft). If you want to import emails from all imap folders (including junk, spam, #), then specify -x ''.

Import emails from a public folder:

```
pilerimport -i 1.2.3.4 -u joe -p secretpassword -f publicfoldername -a the.extra@email.address
```

To import all email except from the folder 'Draft' from imap server 1.2.3.4 using the account 'joe':

```
pilerimport -i 1.2.3.4 -u joe -p secretpassword -x draft
```

**Notes**

The recommended tool to use for imap import is either imapfetch.py shipped by piler, or another external tool.
Let them download emails via IMAP protocol, then run pilerimport to process the downloaded files.

Import messages from a POP3 server:

```
pilerimport -K <pop3 server> -u <username> -p  <password>
```

Import with adding folder information

```
pilerimport -d /path/to/directory -f OLDEMAILS
```

Import with adding folder information using subdirectory names as subfolders

```
pilerimport -d /path/to/directory -f OLDEMAILS -R
```

### How to import a PST file?

pilerimport can't read it, however you can extract the contents of the PST file with the readpst utility from the libpst package, then use pilerimport to import the required messages.

You may use the following command (note that the readpst utility supports PST files up to Outlook 2003):

```
readpst -M -b /path/to/file.pst
```

Important! Make sure that the extracted emails have proper headers, eg. valid From: address (and not just <MAILER-DAEMON> for the sent items), To: address(es), Date: header, Message-ID: header, and even Received: lines. These are crucial for piler, and you will have problems without them.


### How to use impersonation with Exchange?

```
add-mailboxpermission username -AccessRights FullAccess -user superuser
pilerimport -i mail.domain.com -u domain.com/superuser/username -p superpassword
remove-mailboxpermission username -AccessRights FullAccess -user superuser
```

Replace 'username' with your email user (no @domain necessary), 'superuser' with your import user, and 'superpassword' with your import user's password, and 'domain.com' with your domain.
