#!/bin/bash
cp -r .config/ ~
cp .Xresources ~
echo 'move config files finished'

yay -S pavucontrol rofi pcmanfm flameshot brightnessctl\
        lxsession network-manager-applet volctl numlockx\
        blueman picom-ibhagwan-git dunst feh qtile cbatticon