#!/bin/bash

docker compose -f cypress/automation/docker-compose.yaml \
    up --force-recreate -V \
    --no-attach minio \
    --no-attach postgres \
    --no-attach migrate \
    --no-attach seed \
    --no-attach backend \
    --no-attach frontend \
    --abort-on-container-exit
