#!/bin/bash
NO_DEPS=false

# Parse command line options
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    --no-deps)
    NO_DEPS=true
    shift # past argument
    ;;
    *)    # unknown option
    echo "Unknown option: $key"
    exit 1
    ;;
esac
shift # past argument or value
done

cp -r .config/ ~
cp .Xresources ~
echo 'move config files finished'

if [[ ${NO_DEPS} = false ]]; then
  yay -S pavucontrol rofi pcmanfm flameshot brightnessctl\
          lxsession network-manager-applet volctl numlockx\
          blueman picom-ibhagwan-git dunst feh qtile cbatticon\
          betterlockscreen --needed
fi

content="Remember to config betterlockscreen with 'betterlockscreen -u'"
echo -e "\033[31;1m${content}\033[0m"