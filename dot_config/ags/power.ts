import { PANEL_MARGIN_Y } from "main";

const WINDOW_NAME = 'power';

const LockIcon = Widget.Box({
    hpack: 'start',
    child: Widget.Icon({
        icon: 'system-lock-screen-symbolic',
        size: 24
    })
})

const LockSreenLabel = Widget.Box({
    hpack: "start",
    child: Widget.Label({
        label: 'Lock Screen',
        justification: 'left',
    })
})

const LockScreenShortcutBox = Widget.Box({
    hpack: "end",
    child: Widget.Label({
        label: 'Super + Escape',
        justification: 'right',
    })
})

export const PowerBox = (monitor = 0) => Widget.Window({
    monitor,
    name: WINDOW_NAME,
    anchor: ['top', 'right'],
    exclusivity: 'ignore',
    keymode: "none",
    layer: 'overlay',
    margins: [PANEL_MARGIN_Y, 0],
    child: Widget.Box({
        class_name: "power-control",
        css: "min-width: 360px",
        children: [
            Widget.EventBox({
                class_name: "lock",
                hexpand: true,
                child: Widget.CenterBox({
                    start_widget: Widget.Box([
                        LockIcon,
                        LockSreenLabel
                    ]),
                    end_widget: LockScreenShortcutBox
                }),
                on_primary_click: () => {
                    Utils.execAsync('hyprlock')
                    App.toggleWindow(WINDOW_NAME)
                }
            })
        ]
    }),
    visible: false
})

export function Power() {
    const icon = 'system-shutdown-symbolic'

    return Widget.Button({
        class_name: WINDOW_NAME,
        child: Widget.Icon(icon),
        on_clicked: () => App.toggleWindow(WINDOW_NAME)
    })
}