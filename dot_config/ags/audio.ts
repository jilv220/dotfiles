import { PANEL_MARGIN_Y } from "main";
import { Media } from "media";
import PopupWindow from "widgets/PopupWindow";

const audio = await Service.import("audio")

const WINDOW_NAME = 'audio';

const icons = {
    101: "overamplified",
    67: "high",
    34: "medium",
    1: "low",
    0: "muted",
}

function getIcon(type: 'speaker' | 'mic') {
    const speakerVolumeBind = audio.speaker.bind('volume');
    const speakerMuteBind = audio.speaker.bind('is_muted');

    const micVolumeBind = audio.microphone.bind('volume');
    const micMuteBind = audio.microphone.bind('is_muted');

    if (type === 'speaker') {
        return Utils.merge([speakerVolumeBind, speakerMuteBind], (volume, is_muted) => {
            const idx = is_muted ? 0 : [101, 67, 34, 1, 0].find(
                threshold => threshold <= volume * 100) || 0

            return `audio-volume-${icons[idx]}-symbolic`
        })
    } else {
        return Utils.merge([micVolumeBind, micMuteBind], (volume, is_muted) => {
            const idx = is_muted ? 0 : [101, 67, 34, 1, 0].find(
                threshold => threshold <= volume * 100) || 0

            return `microphone-sensitivity-${icons[idx]}-symbolic`
        })
    }
}

export const SpeakerIcon = (size?: number) => Widget.Icon({
    icon: getIcon('speaker'),
    size: size || 18
})

export const MicIcon = (size?: number) => Widget.Icon({
    icon: getIcon('mic'),
    size: size || 18
})

const AudioContainer = () => {
    function SpeakerSlider() {
        return Widget.Slider({
            css:
                `
                min-width: 4px;
                min-height: 4px;
            `,
            hexpand: true,
            draw_value: false,
            on_change: ({ value }) => audio.speaker.volume = value,
            setup: self => self.hook(audio.speaker, () => {
                self.value = audio.speaker.volume || 0
            }),
        })
    }

    const SpeakerLabel = () => Widget.Label({
        class_name: 'volume',
        label: audio.speaker.bind('volume').as((v) => `${Math.floor(v * 100)}%`)
    })

    function MicSlider() {
        return Widget.Slider({
            css:
                `
                min-width: 4px;
                min-height: 4px;
            `,
            hexpand: true,
            draw_value: false,
            on_change: ({ value }) => audio.microphone.volume = value,
            setup: self => self.hook(audio.microphone, () => {
                self.value = audio.microphone.volume || 0
            }),
        })
    }

    const MicLabel = () => Widget.Label({
        class_name: 'volume',
        label: audio.microphone.bind('volume').as((v) => `${Math.floor(v * 100)}%`)
    })


    return Widget.Box({
        css: "min-width: 360px",
        class_name: `${WINDOW_NAME}-popup`,
        vertical: true,
        children: [
            Widget.Box({
                class_name: "volume-container",
                hexpand: true,
                children: [
                    SpeakerIcon(20),
                    SpeakerSlider(),
                    SpeakerLabel(),
                ]
            }),
            Widget.Box({
                class_name: "volume-container",
                hexpand: true,
                children: [
                    MicIcon(20),
                    MicSlider(),
                    MicLabel(),
                ]
            }),
            Media()
        ]
    })
}

export function AudioMenu(monitor = 0) {
    return PopupWindow({
        name: WINDOW_NAME,
        exclusivity: 'exclusive',
        transition: 'none',
        layout: 'top-right',
        child: AudioContainer()
    })
}

export function Audio() {
    return Widget.Button({
        class_name: `${WINDOW_NAME} -btn`,
        child: SpeakerIcon(),
        on_clicked: () => App.toggleWindow(WINDOW_NAME)
    })
}