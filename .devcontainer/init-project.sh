#!/usr/bin/env zsh

cd  /workplaces/

source /usr/share/nvm/init-nvm.sh

nvm i --lts v24

pnpm i --global --save-dev @prisma/language-server

sudo ln -s $(where prisma-language-server) /usr/bin/prisma-language-server
