include conf.mk

RUNNER = $(shell docker ps | grep "9090->" | cut -f1 -d" ")

echo:
	@echo "Runner: ${RUNNER}."

build:
	@echo "Building..."
	docker build -t ${DOCKERIMG} .
	@echo "Building done."

upload:
	@echo "Uploading..."
	@scp -r -i ${EC2KEYPATH} src/ package.json .dockerignore Dockerfile Makefile conf.mk \
	${EC2USER}:/home/ec2-user/alexahomeskill/
	@echo "Uploading done."

stop:
	@if [ -n "${RUNNER}" ]; then echo "Stopping ${RUNNER}..."; docker stop ${RUNNER}; else echo "No currently running containers."; fi;

local: build stop
	@docker run -d -i -t -p 9090:80 ${DOCKERIMG}
	@echo "Docker image built and running locally."

prod: build stop
	@cd /home/ec2-user/alexahomeskill
	@docker run -d -i -t -p 9090:80 -e "NODE_ENV=production" ${DOCKERIMG}
	@echo "Docker image built and running in production."

deploy: upload
	@ssh -i ${EC2KEYPATH} ${EC2USER} "cd /home/ec2-user/alexahomeskill && make prod"

log:
	docker logs --follow --tail 500 -t $(shell docker ps -f ancestor=$(DOCKERIMG) -q)
