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

if [ ! -e  /usr/local/lib/js-debug ]; then
    sudo mkdir -p /usr/local/lib/js-debug

    URL=$(curl -s https://api.github.com/repos/microsoft/vscode-js-debug/releases/latest | jq -r '.assets[] | select(.name | contains("js-debug-dap-")) | .browser_download_url')
    RELEASE_FILE_NAME=$(curl -s https://api.github.com/repos/microsoft/vscode-js-debug/releases/latest | jq -r '.assets[] | select(.name | contains("js-debug-dap-")) | .name')
    cd /tmp
    curl -LO $URL
    sudo tar -xzf /tmp/$RELEASE_FILE_NAME -C /usr/local/lib/
fi
