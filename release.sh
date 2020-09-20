#!/bin/sh

VER=v$(cat package.json| jq -r .version)
hub release create ${VER} -m ${VER}
