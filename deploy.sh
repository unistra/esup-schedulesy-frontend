#!/bin/bash

set -e

PROJECT="unistra-schedule"

TEMP=$(mktemp -d)
REPOSITORY=$(pwd)
DISTANT_REPO=$(git config --get remote.origin.url)
WORKING_DIR="$TEMP/git-clone"

TEST=("root@django-test.u-strasbg.fr:/var/www/static/schedulesy")
TEST_ERNEST=("root@ernest-dev-lb.di.unistra.fr:/var/www/html/alien/schedulesy")
PREPROD=("root@django-rp-pprd.di.unistra.fr:/var/www/static/schedulesy")
PROD=("root@rp10-m.di.unistra.fr:/var/www/static/schedulesy" "root@rp10-s.di.unistra.fr:/var/www/static/schedulesy")

ENVIRONMENT="$2"
case "$ENVIRONMENT" in
    test)
        TARGET=$TEST
	;;
    test_ernest)
	TARGET=$TEST_ERNEST
	;;
    preprod)
        TARGET=$PREPROD
	;;
    prod)
        TARGET=$PROD
	;;
esac

#cd "$TEMP"
#echo "🍻 Cloning repository"
#git clone "$REPOSITORY" "$WORKING_DIR"
#cd "$WORKING_DIR"
#echo
#echo "🔀 Switching to target build"
#git checkout $1
echo "🏗 Installing npm dependencies"
npm install
echo "📦 Packaging stuff"
npm run build:$ENVIRONMENT
echo "🚀 Deploying files"
echo $(pwd)
for i in "${TARGET[@]}"; do
    echo "Scp files to $i"
    scp -r "dist/css" "$i"
    scp -r "dist/js" "$i"
done

# SENTRY
# Sentry needs gitlab repository to be origin
echo "🚧 Manipulating git distant repositories"
git remote remove origin
git remote add origin "$DISTANT_REPO"
PROJECT_VERSION=$(git describe --long)
# Create a release
echo "📌 Telling about $PROJECT_VERSION to Sentry"
sentry-cli releases new -p "$PROJECT" "$PROJECT_VERSION"
# Associate commits with the release
echo "🤖 Associating commits to version"
sentry-cli releases set-commits --auto "$PROJECT_VERSION"
# Declare deployment
echo "🔖 Telling Sentry that we are deploying $PROJECT_VERSION in $ENVIRONMENT"
sentry-cli releases deploys "$PROJECT_VERSION" new -e "$ENVIRONMENT"
echo "🎉 Successfully deployed"
