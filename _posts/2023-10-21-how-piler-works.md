This page describes the procedural internals of piler.

The piler-smtp daemon listens on port 25 waiting for emails to be archived. The mail server is configured to send emails to piler via smtp protocol. Piler supports the STARTTLS smtp extension to provide a secure, encrypted communication over the wire.

The piler-smtp daemon syslogs all its operation using mail.info facility, including the connecting host address, the unique queue ID assigned to the received email, the envelope sender address, and the message size, eg.

```
Jan  1 09:49:27 arc1 piler-smtp[485]: connected from 1.2.3.4:60354 on descriptor 6
Jan  1 09:49:27 arc1 piler-smtp[485]: received: VNHT6E12TZ7F3D5L, from=RunnersWorld@em-runnersworld.com, size=20341
Jan  1 09:49:27 arc1 piler-smtp[485]: disconnected from 1.2.3.4
```

Note that the unique queue ID (VNHT6E12TZ7F3D5L in the above example) is returned to the mail server in the 250 OK message, so the smtp client can track which message has been accepted by piler (The below syslog entry is logged at verbosity=5 level):

```
Jan  1 09:49:27 arc1 piler-smtp[485]: sent: 250 OK <VNHT6E12TZ7F3D5L>#015
```

The piler-smtp daemon does not alter the message in any way, it simply writes the message as it is to a temp file named as the queue ID, eg. VNHT6E12TZ7F3D5L.

The piler daemon child processes are scanning the temp directories written by piler-smtp, and processing any email they can find:

```
Jan  1 09:49:27 arc1 piler[492]: 400000005a49f6220f8c9934001a2673cd65: rcpt=sj@acts.hu
Jan  1 09:49:27 arc1 piler[492]: 1/VNHT6E12TZ7F3D5L: 400000005a49f6220f8c9934001a2673cd65, size=20341/7848, attachments=0, reference=, message-id=<20180101051339.0D6E18699C@mail1.acts.hu>, retention=2557, folder=0, delay=0.0110, status=stored
```

The status can be either of:

- stored: the message is archived
- duplicate: it's a duplicate of an earlier message that piler discarded
- error: some error has happened during the message processing. In this case the piler child process moves the email to /var/piler/error directory for further inspection
- discarded: the message is discarded by a matching archiving rule. In this case the matching rule is logged as well

How piler processes an email

One of the piler child processes handles the received email, and reads the temp file written by piler-smtp using the following stages:

- initializing
- parsing
- splitting the message to parts
- compressing and encrypting
- storing metadata
- storing index data
- removing the temp files

## Initializing

Piler initializes some internal structures, assigns default values, and creates a unique internal piler id. The piler id consists of a TAI64 format timestamp, padded by some random data, and it unambiguously identifies a single archived message.

## Parsing

The parser reads the email, extracts various header fields, eg. From, To, Date, Subject, etc. and any textual parts it can identify.

## Splitting the message to parts

At the same time the parser writes a frame file with '.m' suffix, eg. 400000005a49f6220f8c9934001a2673cd65.m. The frame file contains the email itself except the attachments. The attachments are written to separate files, eg. 400000005a49f6220f8c9934001a2673cd65.a1, 400000005a49f6220f8c9934001a2673cd65.a2 as the 1st, the 2nd, … attachments. The attachments are replaced by a pointer in the frame file. The pointer is used later when reassembling the message.

## Compress and encrypt

The separated message parts and compressed using zlib, then encrypted by using piler.key.

## Storing metadata

The message metadata is stored in mysql database. A unique serial id is generated during the process guaranteed by the mysql table schema, and the serial id is connected with the piler id.

## Storing index data

All data to be indexed (subject, sender, recipients, date, body, etc.) are written to mysql database. The sph_index table is read by the sphinx indexer process.

## Removing any temp files connected to this session
