import GLib from 'gi://GLib'

export const cacheDir = GLib.get_user_cache_dir() + '/limbo'
export const configDir = GLib.get_user_config_dir() + '/limbo'
