# alexahomeskill

**This docker image provides a basic Node OAuth server for Alexa skills using the Alexa Smart Home Skill API.**

It's all in the `Makefile`. You'll need a `conf.mk` with the follwoing content to get started:

```bash
# conf.mk

EC2USER = ec2-user@ec2-123456.compute-1.amazonaws.com
EC2KEYPATH = "/Users/ec2/Documents/aws-private.pem"
DOCKERIMG = ec2/homeskill
```

## Development & deployment

The run `make local` to start a local Docker image with the server available at [http://localhost:9090](http://localhost:9090). Run `make log` to inspect the node logs, run `make stop` to [make it stop](http://www.reactiongifs.com/wp-content/uploads/2012/11/MakeItStop.gif).

Running `make deploy` will upload all source files to your EC2 machine and start the Docker image there. It'll be available at port `9090` as well under the machine's hostname, e.g. `ec2-123456.compute-1.amazonaws.com:9090`.
