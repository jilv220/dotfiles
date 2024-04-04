import { Audio, AudioMenu } from "audio";
import { Battery, BatteryBox } from "battery";
import { Workspaces } from "hyprland";
import { NotificationPopups } from "notifications";
import { Power, PowerBox } from "power";
import { sysTray } from "systray";
import { Time, CalendarMenu } from "time";
import { Applist } from "widgets/Applist";

const scss = `${App.configDir}/style/main.scss`
const css = `${App.configDir}/my-style.css`

// package `dart-sass` for Arch linux
Utils.exec(`sass ${scss} ${css}`)

export const PANEL_MARGIN_Y = 44;

const Bar = (monitor: number = 0) => Widget.Window({
    monitor,
    name: `bar${monitor}`,
    class_name: 'bar',
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        start_widget: Widget.Box({
            children: [
                Workspaces(),
            ]
        }),
        center_widget: Widget.Box({
            spacing: 8,
            children: [
                Time()
            ]
        }),
        end_widget: Widget.Box({
            hpack: "end",
            spacing: 4,
            children: [
                sysTray,
                Audio(),
                Battery(),
                Power(),
            ]
        })
    }),
})

const Panel = (monitor: number = 0) => Widget.Window({
    monitor,
    name: `panel${monitor}`,
    class_name: 'panel',
    anchor: ['bottom', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        center_widget: Widget.Box({
            spacing: 8,
            children: [
                Applist()
            ]
        })
    }),
})

export const agsConf = App.config({
    onConfigParsed: () => {

    },
    windows: [
        Bar(),
        Panel(),
        CalendarMenu(),
        AudioMenu(),
        BatteryBox(),
        NotificationPopups(),
        PowerBox(),
    ],
    style: css
})