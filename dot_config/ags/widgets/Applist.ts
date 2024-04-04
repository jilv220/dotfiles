import { launchApp } from "utils"
import Gtk from "types/@girs/gtk-3.0/gtk-3.0"
import Box from "types/widgets/box"
import { Client } from "types/service/hyprland"

const hyprland = await Service.import("hyprland")
const apps = await Service.import("applications")

const focus = (address: string) => hyprland.messageAsync(
  `dispatch focuswindow address:${address}`)

function groupClients(clients: Client[]) {
  let kv: Map<string, string[]> = new Map();
  for (let client of clients) {
    let addresses = kv.get(client.class)
    if (!addresses) {
      kv.set(client.class, [client.address])
    } else {
      kv.set(client.class, [...addresses, client.address])
    }
  }
  return kv
}

function calculateNextIdx(idx: number, length: number) {
  return (prevClientClass: string, currClientClass: string) => {
    // console.log(prevClientClass + ' ' + currClientClass + ' ' + idx)

    if (prevClientClass.length === 0) {
      return idx
    }

    if (prevClientClass.length !== 0 && prevClientClass !== currClientClass) {
      return idx
    }

    if (idx + 1 < length) {
      return idx + 1
    } else {
      return 0
    }
  }
}

const AppItem = (clientClass: string, addresses: string[]) => {
  const app = apps.list.find(app => app.match(clientClass))
  let activeIdx = 0

  const btn = Widget.Button({
    class_name: "panel-button",
    on_primary_click: () => {
      // console.log(currentIdx)
      const prevClientClass = hyprland.active.client.class

      if (!addresses.length) {
        app && launchApp(app)
      } else {
        const nextIdx = calculateNextIdx(activeIdx, addresses.length)
        activeIdx = nextIdx(prevClientClass, clientClass)
        focus(addresses[activeIdx])
      }
    },
    child: Widget.Icon({
      size: 44,
      icon: app?.icon_name || clientClass
    }),
  })


  const indicators = addresses.map(() => Widget.Box({
    class_name: "indicator",
  }))

  return Widget.Box({
    class_name: 'panel-item',
    attribute: {
      clientClass,
      addresses
    },
    setup: w =>
      w
        .hook(hyprland, () => {
          // highlight the whole panel item
          w.toggleClassName("active", addresses.includes(hyprland.active.client.address))
        })
        .hook(hyprland, (w, name, data) => {
          switch (name) {
            case 'activewindowv2':
              // sync the focus from hyprland
              if (typeof data !== 'string') return

              let address = `0x${data}`
              let idx = addresses.findIndex((a) => a === address)
              if (idx !== -1)
                activeIdx = idx

              break
            default:
              break
          }
        }, 'event')
  },
    Widget.Box({
      vertical: true,
      children: [
        btn,
        Widget.Box({
          spacing: 6,
          hpack: 'center',
          children: indicators
        })
      ]
    })
  )
}

export const Applist = () => {
  let clientEntries = groupClients(hyprland.clients).entries()
  let AppItems: Box<Gtk.Widget, { clientClass: string, addresses: string[] }>[] = []

  for (const [clientClass, clientAddresses] of clientEntries) {
    AppItems.push(AppItem(clientClass, clientAddresses))
  }

  return Widget.Box({
    class_name: "applist",
    children: AppItems,
    setup: w =>
      w.
        hook(hyprland, (w, address) => {
          if (typeof address !== 'string') return

          // get client
          let newClient = hyprland.getClient(address);
          if (!newClient) return

          // is newClient has matching class with existing appitems
          let appItemIdx = w.children.findIndex((c) => c.attribute.clientClass === newClient?.class)
          if (appItemIdx !== -1) {
            let childrenCopy = [...w.children];
            let oldAddresses = childrenCopy[appItemIdx].attribute.addresses;
            childrenCopy[appItemIdx] = AppItem(newClient.class, [...oldAddresses, address])
            w.children = childrenCopy
          } else {
            w.children = [...w.children, AppItem(newClient?.class, [address])]
          }
        }, 'client-added')
        .hook(hyprland, (w, address) => {
          if (typeof address !== 'string') return

          // have to use other address of the same class to remove

          let childrenCopy = [...w.children];
          let appItemIdx = w.children.findIndex((c) => c.attribute.addresses.includes(address))
          // console.log(appItemIdx)

          if (appItemIdx !== -1) {
            let oldAddresses = childrenCopy[appItemIdx].attribute.addresses
            let newAddresses = oldAddresses.filter((oa) => oa !== address)
            // console.log(newAddresses)

            if (newAddresses.length) {
              let clientClass = hyprland.getClient(newAddresses[0])
              if (!clientClass) return

              childrenCopy[appItemIdx] = AppItem(clientClass.class, newAddresses)
              w.children = childrenCopy
            } else {
              childrenCopy.splice(appItemIdx, 1)
              w.children = childrenCopy
            }
          }
        }, "client-removed")
  })
}