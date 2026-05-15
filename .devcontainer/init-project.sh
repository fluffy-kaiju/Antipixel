#!/usr/bin/env sh

cd  /workplaces/

source /usr/share/nvm/init-nvm.sh
echo "source /usr/share/nvm/init-nvm.sh" >> /home/dev/.zshrc
echo "source /usr/share/nvm/init-nvm.sh" >> /home/dev/.bashrc
echo "source /usr/share/nvm/init-nvm.sh" >> /home/dev/.shrc

# nvm i --lts v26
NODE_VERSION=v26
nvm i $NODE_VERSION
nvm alias default $NODE_VERSION
nvm use

pnpm i --global --save-dev @prisma/language-server

if [ ! -e /usr/bin/prisma-language-server ]; then
  sudo ln -s "$(command -v prisma-language-server)" /usr/bin/prisma-language-server
fi
