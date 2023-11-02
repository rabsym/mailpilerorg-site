The delta indexer runs every 30 mins. It means that the search results in GUI also are updated every 30 mins.

Users can access the archived emails using a browser. They have to login using any of their known email address and the password. They can set the preferred language - currently English, (Brazilian) Portuguise, and Hungarian are supported - page length and theme.

By default users can enter the search terms into a text field, and the web interface splits them into components, guesses the format of the components, and builds up a search query. If you type 2012-01-31 then it knows it's a date. If it has @ sign, then it's an email address.

If you need a finer search query, then click on the down arrow at the right corner of the search field, and a popup layer appears where you can specify the sender, recipient, subject, attachment, dates, etc. Then click on the “Search” button, and you get the search results.

There is another way for a more detailed search query. You may specify different labels, such as “from:”, “to:”, “subject”, etc. and pass some values. It's called expert search.

It's also possible to use wildcards while searching. if you are not sure about a word, then it may be enough to enter the beginning of the word, then an asterisk (*), eg. encryp*, and sphinx will find the email if it contains for instance “encrypt”, “encrypted” or “encryption”, etc. By default you need 6 characters, then *.

You may specify the following fields:


| from: | sender address |
| to: | recipient address |
| subject: | subject of the message |
| body: | body of the message |
| date1: | from ('not before') date (YYYY-MM-DD 00:00:00) |
| date2: | to ('not after') date (YYYY-MM-DD 23:59:59) |
| size: | size of the message in bytes |
| direction: | direction of the message |
| d: | same as direction |
| attachment: | attachment type, possible values: word, excel, powerpoint, pdf, compressed, text, odf, image, audio, video, flash, other, any |
| a: | same as attachment |


### Expert search examples

Email from Gmail before 2012.02.29 00:00:00:

```
date2: 2012-02-28, from: @gmail.com
```

Email from Agent Smith:

```
from: Agent Smith
```

Email to someone in Big company after 2012.01.31:

```
date1: 2012-01-31, to: @bigcompany.com
```

Email from jane@aaa.fu OR bill@aaa.fu on 2012.02.15 having any kind of attachment:

```
date1:2012-02-15, date2:2012-02-15, from: jane@aaa.fu, bill@aaa.fu, attachment:any
```

Having a word with underscore, eg. hdd_disk:

```
"hdd disk"
```

Viagra spam bigger than 200 kB spoofing my email address as the sender, and having 'order', then 'now' in the body

```
size:>.2M, subject: viagra OR cialis, body: order << now, from: my@email.address
```

Price list to jenny@aaa.fu, in pdf attachment(s) smaller than 150 kB

```
direction: inbound, size:<150k, attachment: pdf, subject: price list, to: jenny@aaa.fu
```

### Additional notes

By hitting the 'Search' button without entering any search criteria, piler returns the newest 1000 messages in a paged style. The search engine (=sphinx) has a limit (1000 by default) on the returned results. It's possible to return more hits, however you have to edit sphinx.conf to do that.

You can use any sphinx operators, eg. |, &, «, for the subject and body fields.

The entered search phrases are in explicit Boolean AND relation, eg. cat dog means that the document has to contain both cat and dog.

### Some examples:

```
cat dog = having cat and dog (order is not important)
cat OR dog = having cat or dog
cat | dog = having cat or dog
"cat dog" = having the expression "cat dog"
!dog = not having dog
-dog = not having dog
"cat dog"~10 = proximity search
cat << dog = before operator: cat has to precede dog
```

See 5.2. Boolean query syntax and 5.3. Extended query syntax for more details on the sphinx search site.

### Using the search results

If you have a search result then you can view any of the messages in the result by clicking on the subject line. A popup window will come up showing the results. You can also download the given message as an EML file, or restore it to your mailbox via SMTP. You may assign tags to the email in the popup window.

It's also possible to download the search results from the current page as a zip file. To do so, click on the blue download icon.

Piler allows you to save the search criteria for later use by clicking on the “Save” button. If you have any saved searches click on the “Load” button to have them shown, then you can run the saved search by clicking on it.

### Customizing the GUI

You may override settings in config.php (usually in /var/piler/www) by putting the site-specific variables to config-site.php (it's in the ${sysconfdir}/piler directory, by default it's /usr/local/etc/piler).

Eg. you want to customize the page length sizes to add 100 to the list. In that case add the following to config-site.php:

```
$paging = [10,20,30,50,100];
```
