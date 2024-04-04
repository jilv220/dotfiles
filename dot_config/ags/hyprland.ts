const hyprland = await Service.import("hyprland");

export const focusedTitle = Widget.Label({
	label: hyprland.active.client.bind("title"),
	visible: hyprland.active.client.bind("address").as((addr) => !!addr),
});

const dispatch = (ws: string | number) =>
	hyprland.messageAsync(`dispatch workspace ${ws}`);

export function Workspaces() {
	const activeId = hyprland.active.workspace.bind("id");

	return Widget.EventBox({
		class_name: "workspaces",
		onScrollUp: () => dispatch("+1"),
		onScrollDown: () => dispatch("-1"),
		child: Widget.Box({
			children: Array.from({ length: 10 }, (_, i) => i + 1).map((i) =>
				Widget.Button({
					attribute: i,
					label: `${i}`,
					onClicked: () => dispatch(i),
					setup: (w) =>
						w.hook(hyprland, () => {
							const active = hyprland.active.workspace.id === i;
							const wsWindowCount = hyprland.getWorkspace(i)?.windows || 0;
							const occupied = wsWindowCount > 0 && !active;

							const cns: string[] = [];
							if (active) {
								cns.push("focused");
							} else if (occupied) {
								cns.push("occupied");
							}

							w.class_names = cns;
						}),
				}),
			),

			// remove this setup hook if you want fixed number of buttons
			setup: (self) =>
				self.hook(hyprland, () => {
					for (const btn of self.children) {
						btn.visible = hyprland.workspaces.some(
							(ws) => ws.id === btn.attribute,
						);
					}
				}),
		}),
	});
}
