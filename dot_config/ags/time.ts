const WINDOW_NAME = 'calendar';

const time = Variable('', {
    poll: [1000, 'date +"%b %e  %-I:%M %p"'],
})

const calendar = Widget.Calendar({
    class_name: "calendar",
    showDayNames: true,
    showDetails: true,
    showHeading: true,
    showWeekNumbers: true,
    onDaySelected: ({ date: [y, m, d] }) => {
        print(`${y}. ${m}. ${d}.`)
    },
})

export const CalendarBox = (monitor = 0) => Widget.Window({
    monitor,
    name: WINDOW_NAME,
    anchor: ['top'],
    exclusivity: 'ignore',
    keymode: "none",
    layer: 'overlay',
    margins: [44, 0],
    child: calendar,
    visible: false
})

export function Time() {
    return Widget.Button({
        class_name: "time",
        label: time.bind(),
        on_clicked: () => App.toggleWindow(WINDOW_NAME)
    })
}