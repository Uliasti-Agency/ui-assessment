#!/bin/sh

mkdir -p ~/.ssh
chmod 700 ~/.ssh

echo "$SSH_KNOWN_HOSTS" >> ~/.ssh/known_hosts
chmod 644 ~/.ssh/known_hosts

echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

git config --global user.email "ci@sly.ch"
git config --global user.name "GitLab CI/CD"

git remote set-url origin "git@gitlab.com:$CI_PROJECT_NAMESPACE/$CI_PROJECT_NAME.git"
git checkout "$CI_COMMIT_BRANCH"
git status
