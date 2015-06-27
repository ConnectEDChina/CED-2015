[![ConnectED-logo][ConnectED-logo-url]](http://connected-china.org)

# ConnectED China 2015

This is the open source repository for ConnectED China website.

## Structuring

This application is built on express.js and utilizes the AMD framework
for asynchronous JavaScript loading. As of now, this project uses ECMAScript 5.
A pending revision to comply with ECMAScript 6 will come in the near future.

Task has been automated using gulp. To build the application, run

```bash
gulp package
```

Node.js clustering has been implemented to
scale this application for a predicted concurrency scale of 500.
Using the following command

```bash
ab -r 3000 -c 500 http://connected-china.org/
```

to benchmark the server performance on a Linode 2048 VPS
yields:

```
```

### List of URLs

  * [/](http://connected-china.org/) Home page
  * [/registration](http://connected-china.org/registration/) Registration page
  * [/about](http://connected-china.org/about/) About page

## License

[ConnectED China Content Distribution License]()

[ConnectED-logo-url]: http://connected-china.org/images/logo.png
