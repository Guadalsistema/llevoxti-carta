#!/bin/sh

function menu () {
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

if  [[ $1 =~ ^stop$ ]]; then
	podman stop ${PODNAME}
	exit 0
fi

if  [[ $1 =~ ^start$ ]]; then
	podman run --rm -dit \
		--name ${PODNAME} -p 8080:80 \
		-v "$PWD/app":/usr/local/apache2/htdocs/ \
		docker.io/library/httpd:2.4
	exit 0
fi

exit 1
