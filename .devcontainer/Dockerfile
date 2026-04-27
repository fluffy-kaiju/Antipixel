FROM archlinux:base
    LABEL org.opencontainers.image.authors="Fluffy Kaiju <fluffy@fluffy-laptop>"


RUN pacman -Syu --noconfirm base-devel sudo zsh nvm git pnpm typescript-language-server && \
    pacman -Scc --noconfirm

RUN useradd -m -s /bin/zsh dev
WORKDIR /home/dev/
RUN chown -R dev:dev /home/dev/
RUN echo "dev ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

USER dev

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
RUN echo "source /usr/share/nvm/init-nvm.sh" >> .zshrc
RUN echo "source /usr/share/nvm/init-nvm.sh" >> .bashrc

RUN SHELL="/bin/zsh" pnpm setup
RUN SHELL="/bin/bash" pnpm setup

WORKDIR /tmp/
RUN git clone https://aur.archlinux.org/yay-bin.git
WORKDIR /tmp/yay-bin/
RUN makepkg -si --noconfirm
RUN yay -Syu emacs-lsp-booster --noconfirm
