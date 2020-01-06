#!/bin/bash

set -e

PROJECT="unistra-schedule"

TEMP=$(mktemp -d)
REPOSITORY=$(pwd)
DISTANT_REPO=$(git config --get remote.origin.url)
WORKING_DIR="$TEMP/git-clone"

TEST_STATIC=("root@django-test.u-strasbg.fr:/var/www/static/schedulesy")
TEST_TEMPLATE=("root@django-test.u-strasbg.fr:/home/django/schedulesy-test.app.unistra.fr/current/schedulesy/templates")
PREPROD_STATIC=("root@django-rp-pprd.di.unistra.fr:/var/www/static/schedulesy")
PREPROD_TEMPLATE=("root@django-pprd-w1:/home/django/schedulesy-pprd.app.unistra.fr/current/schedulesy/templates" "root@django-pprd-w2:/home/django/schedulesy-pprd.app.unistra.fr/current/schedulesy/templates")
PROD_STATIC=("root@rp10-m.di.unistra.fr:/var/www/static/schedulesy" "root@rp10-s.di.unistra.fr:/var/www/static/schedulesy")
PROD_TEMPLATE=("root@django-w3:/home/django/monemploidutemps.unistra.fr/current/schedulesy/templates" "root@django-w4:/home/django/monemploidutemps.unistra.fr/current/schedulesy/templates")

ENVIRONMENT="$2"
case "$ENVIRONMENT" in
    test)
	TARGET_STATIC=("${TEST_STATIC[@]}")
	TARGET_TEMPLATE=("${TEST_TEMPLATE[@]}")
	;;
    preprod)
	TARGET_STATIC=("${PREPROD_STATIC[@]}")
	TARGET_TEMPLATE=("${PREPROD_TEMPLATE[@]}")
	;;
    prod)
	TARGET_STATIC=("${PROD_STATIC[@]}")
	TARGET_TEMPLATE=("${PROD_TEMPLATE[@]}")
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
for i in "${TARGET_STATIC[@]}"; do
    echo "Scp static files to $i"
    scp -r "dist/css" "$i"
    scp -r "dist/js" "$i"
done
for i in "${TARGET_TEMPLATE[@]}"; do
    echo "Scp template to $i"
    scp "dist/base.html" "$i"
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
