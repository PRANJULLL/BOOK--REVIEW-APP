#!/bin/bash
# Script to remove all commits and contributors related to "lovable" from git history using git filter-repo

# Backup your repo before running this script!

# Remove commits where author or committer name or email contains "lovable"
git filter-repo --commit-callback '
if b"lovable" in commit.author_name.lower() or b"lovable" in commit.author_email.lower() or b"lovable" in commit.committer_name.lower() or b"lovable" in commit.committer_email.lower():
    commit.skip()
'
