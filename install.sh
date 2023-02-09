#!/bin/bash
cp -r .config/ ~
echo 'move config files finished'

yay -S pavucontrol dmenu pcmanfm flameshot brightnessctl\
        lxsession network-manager-applet volctl numlockx\
        blueman picom-ibhagwan-git dunst feh qtile