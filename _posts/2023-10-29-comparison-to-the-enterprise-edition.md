While the open source version is a cool stuff, however, the enterprise edition has some advantages:

  * support for multitenancy

  * easier installation, it ships as a deb package and an install script

  * the [Launch my instance!](https://mailpiler.com/launch-my-instance/) free service

  * support for multiple nodes (scale out), it may come handy if you have really lots of data

  * flexible SMTP routing

  * more choices for authentication, including SSO against Azure AD, AWS Cognito, and other 3rd party Oauth providers, eg. github, linkedin, etc.

  * improved attachment storage. The open source version needs the attachment table to re-assemble the email, the commercial edition doesn't need it

  * support for compressed or zipped top level dirs. Both editions store one or more files for a single email, thus resulting millions of files in /var/piler/store directory. The enterprise edition allows you to zip them to a series of zip files for easier backup

  * support for [Prometheus](https://prometheus.io) monitoring

  * support for S3 compatible object stores. You may keep your data files off the archive host, eg. [Amazon AWS S3](https://aws.amazon.com/s3/), [Wasabi](https://wasabi.com/) object store, [Exoscale](https://www.exoscale.com/object-storage/), etc or even in a local [minio](https://min.io) installation.

  * REST api to automate frequent tasks

  * free support during the 30 day [evaluation period](https://mailpiler.com/download.html)

  * digitally sign exported emails by pilerexport

  * private issue tracker in case of the support service

  * [Zipkin](https://zipkin.io/) compatible tracing support for the GUI. You may use [Jaeger](https://www.jaegertracing.io/) as well
