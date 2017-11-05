#!/usr/bin/env bash
set -e

source .env.production

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function notice() {
  printf "${GREEN}---->${NC} $1\n"
}

notice 'building new app'
./build-production.sh

notice 'ensuring web folder'
ssh $server "mkdir -p $deploy_dir"

notice 'copying files'
scp -q bin/* $server:$deploy_dir/

CMDS=$(cat <<DEPLOYSCRIPT
  echo -e "${GREEN}---->${NC} unpacking files"
  cd $deploy_dir
  full_path=\$(pwd)
  tar xzf budgetal.tar.gz
  tar xzf frontend.tar.gz

  echo -e "${GREEN}---->${NC} cleaning up files"
  rm budgetal.tar.gz
  rm frontend.tar.gz

  echo -e "${GREEN}---->${NC} symlinking avatar folder"
  if [ ! -L "build/users" ]; then
    ln -s \$full_path/frontend/public/users \$full_path/build/users
  fi
DEPLOYSCRIPT
)
ssh $server -t "$CMDS"

notice 'restarting app'
eval $restart_cmd

printf "      ${GREEN}Done.${NC}\n"