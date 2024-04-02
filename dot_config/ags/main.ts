import { Audio, AudioBox } from "audio";
import { Battery, BatteryBox } from "battery";
import { Workspaces } from "hyprland";
import { NotificationPopups } from "notifications";
import { Power, PowerBox } from "power";
import { sysTray } from "systray";
import { Time, CalendarBox } from "time";

export const PANEL_MARGIN_Y = 44;

const Bar = (monitor: number = 0) => Widget.Window({
    monitor,
    name: `bar${monitor}`,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        start_widget: Widget.Box({
            children: [
                Workspaces()
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

export const agsConf = App.config({
    windows: [
        Bar(),
        CalendarBox(),
        AudioBox(),
        BatteryBox(),
        NotificationPopups(),
        PowerBox(),
    ],
    style: './style.css'
})