#!/bin/bash
cd "`dirname $0`/../"

pushd nginx/ssl

openssl req -new -newkey rsa:4096 -days 3650 -nodes -x509 \
  -subj "/C=JP/ST=Okinawa/O=hoge/CN=hoge" -keyout certificate.key -out certificate.crt

popd

docker-compose up
