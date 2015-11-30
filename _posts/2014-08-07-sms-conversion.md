---
layout: post
title: "Universal SMS Conversion Tool"
tags: [tools, github, python]
---
Edit: Now available in pip, just `pip install smstools`.

Working on a project at INQ Mobile I started this tool to convert downloaded
Google Voice messages to native Android smsmms.db sqlite databases. I was doing
local analytics and wanted a big real-world dataset. I built what I called
*Android-SMS-DB-importer* to import six years of SMS history from two iPhones,
Google Voice, and Android into one Android smsmms.db file. Since then I've expanded
the tool's scope to be a universal SMS translator.

There are lots of real use cases for such a tool. Migrating from/to iPhone from/to
Android? Leaving Google Voice? Want a searchable CSV, JSON, or XML file of
your conversations? Also making a sweet SMS processing app and you want to
run on *all* your past texts at once? Want to move all your messages from your
past into a new, date-sorted, database? It should be ready to roll.

{% highlight bash linenos=table %}
pip install smstools
smstools iphone.db androids.xml android.db out.csv
{% endhighlight %}

Imported. Normalized. Sorted. Exported. Easy.

Go clone it at [github.com/t413/SMS-Tools](https://github.com/t413/SMS-Tools)

Convert your message history between:
- iOS 5, 6, and 7 databases directly (from backup or from your jailbroken phone directly)
- Android mmssms.db database (directly from phone)
- Android XML from the [SMS Backup & Restore](http://android.riteshsahu.com/apps/sms-backup-restore) app
- CSV files
- JSON files
- google voice data dump (see more details below)
