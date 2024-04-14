import type { Client } from "types/service/hyprland";

const hyprland = await Service.import("hyprland");

const getActiveWindow = () => {
  const msg = hyprland.message("j/activewindow");
  const res = JSON.parse(msg) as Client | undefined;

  return res;
};

const TitleLabel = (label?: string) => {
  return Widget.Label({
    label,
    visible: label ? true : false,
    maxWidthChars: 50,
    truncate: "end",
  });
};

export function Title() {
  const client = getActiveWindow();
  return Widget.Box(
    {
      class_name: "focused-title",
      setup: (w) =>
        w.hook(hyprland, (w) => {
          const client = getActiveWindow();
          w.child = TitleLabel(client?.title);

          w.toggleClassName("fullscreen", client?.fullscreen || false);
        }),
    },
    TitleLabel(client?.title),
  );
}

const dispatch = (ws: string | number) =>
  hyprland.messageAsync(`dispatch workspace ${ws}`);

export function Workspaces() {
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
