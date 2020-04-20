FROM golang:onbuild

RUN mkdir -p /usr/app/sheephouse/zipper
WORKDIR /usr/app/sheephouse/zipper
COPY . .

EXPOSE 3001
CMD ["go","run","s3zipper.go"]