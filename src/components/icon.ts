export function Icon(name: string | Binding<any, any, string>, size = 16) {
  return Widget.Icon({ icon: name, size })
}
