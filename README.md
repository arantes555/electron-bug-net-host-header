# Testcase for regression in electron's `net` module that forbids setting a `Host` header

Starting with electron@7, setting a `host` header when creating a request makes it fail with `net::ERR_INVALID_ARGUMENT`.

On electron@6, such a request succeeds.

In this repo, we test this by launching a simple HTTP server, and running a simple script that makes such requests,
using multiple versions of electron.

Simply do:
```bash
npm i
npm start
```

When running this, we can see that in electron@6 all requests succeed. On electron@7 however, all requests that set a
`Host` header fail with said error. 

This problem makes it impossible to explicitly set the `Host`, which is normal in a web context, but does not make sense
in this case since requests are not done by a webpage.
