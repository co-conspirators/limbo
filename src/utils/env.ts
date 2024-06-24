import GLib from 'types/@girs/glib-2.0/glib-2.0'

export const cacheDir = (GLib.getenv('XDG_CACHE_HOME') || `${GLib.getenv('HOME')}/.cache`) + '/limbo'

export const configDir = (GLib.getenv('XDG_CONFIG_HOME') || `${GLib.getenv('HOME')}/.config`) + '/limbo'
