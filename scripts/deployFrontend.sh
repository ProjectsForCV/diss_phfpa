#!/bin/bash
# Deploy frontend
cd ~/apps/CSC3002_DanielCooke_ProjectAllocation/frontend
rm -rf dist
rm -rf /var/www/html
mkdir /var/www/html
npm run prod
cd dist
cp -rf . /var/www/html
