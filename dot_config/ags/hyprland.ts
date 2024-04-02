const hyprland = await Service.import('hyprland')

export const focusedTitle = Widget.Label({
    label: hyprland.active.client.bind('title'),
    visible: hyprland.active.client.bind('address')
        .as(addr => !!addr),
})

const dispatch = (ws: string | number) => hyprland.messageAsync(`dispatch workspace ${ws}`);

export function Workspaces() {
    const activeId = hyprland.active.workspace.bind("id");

    return Widget.EventBox({
        class_name: "workspaces",
        onScrollUp: () => dispatch('+1'),
        onScrollDown: () => dispatch('-1'),
        child: Widget.Box({
            children: Array.from({ length: 10 }, (_, i) => i + 1).map(i => Widget.Button({
                attribute: i,
                class_name: activeId.as((a) => i === a ? "focused" : ""),
                label: `${i}`,
                onClicked: () => dispatch(i),
            })),

            // remove this setup hook if you want fixed number of buttons
            setup: self => self.hook(hyprland, () => self.children.forEach(btn => {
                btn.visible = hyprland.workspaces.some(ws => ws.id === btn.attribute)
            })),
        }),
    })
}