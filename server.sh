#!/bin/sh

CONTAINER_ENGINE=""
if command -v podman; then
	CONTAINER_ENGINE="podman"
else
	CONTAINER_ENGINE="docker"
fi

menu () {
	echo "usage $(basename $0) [-h] (stop|start|delete)"
}

if [ $# -eq 0 ]; then
    echo "No arguments supplied"
	exit 0
fi

while getopts h opt; do
	case "${opt}" in
		h) menu;;
	esac
done

PODNAME="llevoxti-carta"

if  echo $1 | grep -q "^stop$"; then
	${CONTAINER_ENGINE} stop ${PODNAME}
	exit 0
fi

if  echo $1 | grep -q "start$"; then
	${CONTAINER_ENGINE} run --rm -d \
		--name ${PODNAME} -p 8080:80 \
		-v "${PWD}/app:/usr/local/apache2/htdocs/" \
		docker.io/library/httpd:2.4
	exit 0
fi

exit 1
