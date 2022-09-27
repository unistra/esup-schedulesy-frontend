#!/bin/bash

set -e

PROJECT="unistra-schedule"

TEMP=$(mktemp -d)
REPOSITORY=$(pwd)
DISTANT_REPO=$(git config --get remote.origin.url)
WORKING_DIR="$TEMP/git-clone"

TEST_STATIC=("root@schedulesy-test.app.unistra.fr:/var/www/static/schedulesy")
TEST_TEMPLATE=("root@schedulesy-test.app.unistra.fr:/home/django/schedulesy-test.app.unistra.fr/current/schedulesy/templates")
PREPROD_STATIC=("root@rp-dip-pprd-public.di.unistra.fr:/var/www/static/schedulesy")
PREPROD_TEMPLATE=("root@django-pprd-w3.di.unistra.fr:/home/django/schedulesy-pprd.app.unistra.fr/current/schedulesy/templates" "root@django-pprd-w4.di.unistra.fr:/home/django/schedulesy-pprd.app.unistra.fr/current/schedulesy/templates")
PROD_STATIC=("root@rp-dip-public-m.di.unistra.fr:/var/www/static/schedulesy" "root@rp-dip-public-s.di.unistra.fr:/var/www/static/schedulesy")
PROD_TEMPLATE=("root@django-w7.di.unistra.fr:/home/django/monemploidutemps.unistra.fr/current/schedulesy/templates" "root@django-w8.di.unistra.fr:/home/django/monemploidutemps.unistra.fr/current/schedulesy/templates")

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
    scp -r "dist/img" "$i"
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
