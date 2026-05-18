FROM archlinux:base
    LABEL org.opencontainers.image.authors="Fluffy Kaiju <fluffy@fluffy-laptop>"

RUN pacman -Syu --noconfirm base-devel sudo zsh git && \
    pacman -Scc --noconfirm

RUN useradd -m -s /bin/zsh dev
WORKDIR /home/dev/
RUN chown -R dev:dev /home/dev/
RUN echo "dev ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

USER dev

WORKDIR /tmp/
RUN git clone https://aur.archlinux.org/yay-bin.git
WORKDIR /tmp/yay-bin/
RUN makepkg -si --noconfirm
RUN rm -rf /tmp/yay-bin/

RUN yay -Syu nodejs emacs-lsp-booster nvm pnpm ripgrep jq lsof\
    yaml-language-server typescript-language-server dockerfile-language-server bash-language-server vscode-json-languageserver\
    --noconfirm

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
RUN echo "source /usr/share/nvm/init-nvm.sh" >> /home/dev/.zshrc
RUN echo "source /usr/share/nvm/init-nvm.sh" >> /home/dev/.bashrc
RUN echo "source /usr/share/nvm/init-nvm.sh" >> /home/dev/.shrc
RUN touch /home/dev/.tramp_history

RUN SHELL="/bin/zsh" pnpm setup
RUN SHELL="/bin/bash" pnpm setup
