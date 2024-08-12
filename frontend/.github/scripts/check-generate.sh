#!/bin/bash
set -euo pipefail
set -x

pnpm generate

if [[ "$(git status --porcelain=v2 | wc -l)" -ne 0 ]] ; then
    echo 'You need to run "pnpm generate" and commit the changes!'
    git status --verbose --short
    exit 1
fi
