#!/bin/bash
set -eu
cd `dirname $0`
source config

cd ../

npm run build
npm run generate

aws s3 sync ./dist s3://${cfg_bucket_name}/playground/sls-rtc
aws cloudfront create-invalidation --distribution-id ${cfg_cf_distribution_id} --paths "/playground/sls-rtc/*"
