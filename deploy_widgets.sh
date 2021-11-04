#!/bin/bash

echo "DEPLOYING BEAM WIDGETS...."

readonly AWS_DEFAULT_PROFILE="default"
readonly DEFAULT_DEPLOY_ENVIRONMENT="development"
readonly DEVELOPMENT_CDN_DIST_ID="E3JKVQ560GBMPT"
readonly STAGING_CDN_DIST_ID="E1E2FJN3FAG56A"
readonly PRODUCTION_CDN_DIST_ID="xxxx"
readonly DEVELOPMENT_S3_BUCKET_NAME="dev-beam-widgets"
readonly STAGING_S3_BUCKET_NAME="staging-beam-widgets"
readonly PRODUCTION_S3_BUCKET_NAME="production-beam-widgets"
readonly DEFAULT_SOURCE_DIRECTORY="./build/"
# FOR LINUX (Get working dir)
# readonly SCRIPT_ABS_PATH=$(realpath $0)
# readonly SCRIPT_DIR=$(dirname $SCRIPT_ABS_PATH)
# FOR MAC (Get working dir)
readonly SCRIPT_DIR=$(PWD)

usage() {
    cat << EOF
$0 usage
    -l "AWS profile to use"
    -p "Partner name"
    -s "Path to source bundle directory"
    -e "The environment we are deploying to, this value must be either "development", "staging", or "production"; defaults to development"
    -h "Display this menu"
EOF
    exit 1
}

longopts="l:p:e:h:s:"
while getopts ${longopts} arg; do
    case "${arg}" in
        l) AWS_PROFILE="${OPTARG}";;
        e) ENVIRONMENT="${OPTARG}";;
        p) PARTNER="${OPTARG}";;
        s) SOURCE="${OPTARG}";;
        h) usage;;
        ?) echo "Invalid option -${OPTARG}"; usage;;
        :) echo "using defaults"; break;;
    esac
done

: ${AWS_PROFILE:=$AWS_DEFAULT_PROFILE}
: ${ENVIRONMENT:=$DEFAULT_DEPLOY_ENVIRONMENT}
: ${SOURCE:=$DEFAULT_SOURCE_DIRECTORY}

if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "development" ]]; then
    echo "unknown environment $ENVIRONMENT"
    usage
fi

S3_BUCKET_NAME="$DEVELOPMENT_S3_BUCKET_NAME"
CDN_DIST_ID="$DEVELOPMENT_CDN_DIST_ID"

if [ "$ENVIRONMENT" = "production" ]; then
    S3_BUCKET_NAME="$PRODUCTION_S3_BUCKET_NAME"
    CDN_DIST_ID="$PRODUCTION_CDN_DIST_ID"
elif [ "$ENVIRONMENT" = "staging" ]; then
    S3_BUCKET_NAME="$STAGING_S3_BUCKET_NAME"
    CDN_DIST_ID="$STAGING_CDN_DIST_ID"
elif [ "$ENVIRONMENT" = "development" ]; then
    S3_BUCKET_NAME="$DEVELOPMENT_S3_BUCKET_NAME"
    CDN_DIST_ID="$DEVELOPMENT_CDN_DIST_ID"
fi

if [ $SOURCE != "" ]; then
    SOURCE="$SOURCE"
fi

cd $SCRIPT_DIR/..

# PUT YOUR BUILD SCRIPT HERE
# E.G. npm run build
npm run build-dev

echo "aws profile = $AWS_PROFILE"
echo "environment = $ENVIRONMENT"
echo "source path = "$SOURCE""
echo "deploy path = widgets/$PARTNER"

aws --profile $AWS_PROFILE s3 cp ./$SORUCE s3://$S3_BUCKET_NAME/widgets/$PARTNER --recursive --acl "public-read"

aws --profile $AWS_PROFILE cloudfront create-invalidation --distribution-id $CDN_DIST_ID --paths "/*"
