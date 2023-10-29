==== Comparison to the enterprise edition ====

While the open source version is a cool stuff, however, the enterprise edition has some advantages:

  * support for multitenancy

  * easier installation, it ships as a deb package and an install script

  * the [[https://mailpiler.com/launch-my-instance/|"Launch my instance!"]] free service

  * support for multiple nodes (scale out), it may come handy if you have really lots of data

  * flexible SMTP routing

  * more choices for authentication by using [[https://auth0.com|Auth0]], including SSO against Azure AD, 3rd party Oauth providers, eg. github, linkedin, etc.

  * improved attachment storage. The open source version needs the attachment table to re-assemble the email, the commercial edition doesn't need it

  * support for compressed or zipped top level dirs. Both editions store one or more files for a single email, thus resulting millions of files in /var/piler/store directory. The enterprise edition allows you to zip them to a series of zip files for easier backup

  * support for [[https://prometheus.io|Prometheus]] monitoring

  * support for S3 compatible object stores. You may keep your data files off the archive host, eg. [[https://aws.amazon.com/s3/|Amazons S3]], [[https://wasabi.com/|Wasabi]] object store, [[https://www.exoscale.com/object-storage/|Exoscale]], etc or even in a local [[https://min.io|minio]] installation.

  * REST api to automate frequent tasks

  * free support during the 30 day [[https://mailpiler.com/free-trial/|free trial]]

  * digitally sign exported emails by pilerexport

  * private issue tracker in case of the support service

  * [[https://zipkin.io/|zipkin]] compatible tracing support for the GUI. You may use [[https://www.jaegertracing.io/|Jaeger]] as well
