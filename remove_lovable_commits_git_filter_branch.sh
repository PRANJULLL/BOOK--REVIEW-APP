#!/bin/bash
# Alternative script to remove commits and contributors related to "lovable" using git filter-branch

# Backup your repo before running this script!

git filter-branch --commit-filter '
if [ "$GIT_AUTHOR_NAME" = "lovable" ] || [ "$GIT_COMMITTER_NAME" = "lovable" ] || [ "$GIT_AUTHOR_NAME" = "lovable-dev[bot]" ] || [ "$GIT_COMMITTER_NAME" = "lovable-dev[bot]" ]; then
    skip_commit "$@"
else
    git commit-tree "$@"
fi' -- --all
