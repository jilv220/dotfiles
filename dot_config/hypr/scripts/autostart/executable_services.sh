#!/bin/bash

# Wallpaper
hyprpaper

# Shell
ags &
# IME
fcitx5 -d &

nm-applet --indicator &
/usr/lib/mate-polkit/polkit-mate-authentication-agent-1 &

# Clipboard
wl-paste --type text --watch cliphist store #Stores only text data
wl-paste --type image --watch cliphist store #Stores only image data

# Idle 
hypridle
