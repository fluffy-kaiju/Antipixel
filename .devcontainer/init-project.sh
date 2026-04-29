#!/usr/bin/env zsh

cd  /workplaces/

source /usr/share/nvm/init-nvm.sh

nvm i --lts v24

pnpm i --global --save-dev @prisma/language-server

if [ ! -e /usr/bin/prisma-language-server ]; then
  sudo ln -s "$(command -v prisma-language-server)" /usr/bin/prisma-language-server
fi
