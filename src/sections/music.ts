import { Icon, Row, Section, TransparentButton } from 'src/components'
import { getVibrantSwatches } from 'src/utils/extract-palette'
import { nearestNeighbor, quantizePixels, selectDarkVibrantPixel } from 'src/utils/quantize'
import cairo from 'types/@girs/cairo-1.0'
import Gdk from 'types/@girs/gdk-3.0/gdk-3.0'
import GdkPixbuf from 'types/@girs/gdkpixbuf-2.0/gdkpixbuf-2.0'
import { Align, Orientation } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'
import type { MprisPlayer } from 'types/service/mpris'
import type { Stream } from 'types/service/audio'

const mpris = await Service.import('mpris')

const MusicColor = Variable({ color: '#1e1e2e', imageUrl: '' })

// Takes a URL, stores the file in a temporary dir, loads it into cairo and fades the left side with a solid color
export function SongArt(url: string) {
  const image = `/tmp/ags/song-art/${url.split('/').pop()}.jpg`
  Utils.exec(`mkdir -p /tmp/ags/song-art`)
  Utils.exec(`curl -o ${image} ${url}`)

  return Widget.DrawingArea({
    widthRequest: 32,
    heightRequest: 32,
    /** Draws a faded image from left to right */
    drawFn: (_, cr, width, height) => {
      const pixBuf = GdkPixbuf.Pixbuf.new_from_file(image)
      const imageSurface = Gdk.cairo_surface_create_from_pixbuf(pixBuf, 1, null)

      if (MusicColor.value.imageUrl !== url) {
        const pixels = pixBuf.get_pixels().reduce<[number, number, number][]>((acc, val, i, pixels) => {
          if (i % 3 === 0) acc.push([val, pixels[i + 1], pixels[i + 2]])
          return acc
        }, [])
        const width = pixBuf.get_width()
        const height = pixBuf.get_height()

        const scaleDownFactor = Math.max(1, Math.floor(Math.max(width, height) / 200))
        const scaledDownPixels = nearestNeighbor(pixels, width, height, scaleDownFactor)
        const vibrantSwatches = quantizePixels(scaledDownPixels, 64)
        const pixel = selectDarkVibrantPixel(vibrantSwatches)
        const rgbToHex = (rgb: [number, number, number]) =>
          `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`
        MusicColor.setValue({ color: rgbToHex(pixel), imageUrl: url })
      }

      // Calculate the scale factor to fill the image
      const imgWidth = imageSurface.getWidth()
      const imgHeight = imageSurface.getHeight()
      const scaleFactor = Math.min(width / imgWidth, height / imgHeight)
      cr.scale(scaleFactor, scaleFactor)

      const borderRadius = 6
      for (let x = 0; x < width; x++) {
        // Calculate the y offset for the current x position to comply with the border radius
        // on the right side only
        const borderRadiusAmount = Math.max(0, x - width + borderRadius + 1) / borderRadius
        // x^2 + (y - 1)^2 = 1 => y = sqrt(1 - x^2) - 1
        // Circle transposed down to be x=0,y=0 and x=1,y=-1
        const y = Math.sqrt(1 - borderRadiusAmount ** 2) - 1
        const yOffset = (-y * borderRadius) / scaleFactor

        // clip to the current column
        cr.rectangle(x / scaleFactor, yOffset, 1 / scaleFactor, imgHeight - yOffset * 2)
        cr.save()
        cr.clip()

        // paint the image
        cr.setSourceSurface(imageSurface, 0, 0)
        cr.paintWithAlpha(x / width)

        // revert the clip
        cr.restore()
      }
    },
  })
}

const audio = await Service.import('audio')
const changeSpotifyVolume = (raise: boolean) => {
  // @ts-expect-error - findLast actually does exist
  const spotifyStream = audio.apps.findLast((app: Stream) => app.stream?.name === 'spotify')
  if (!spotifyStream) return

  const newVolume = raise
    ? Math.min(1, spotifyStream.volume + 0.1) // if raise
    : Math.max(0, spotifyStream.volume - 0.1) // if lower

  spotifyStream.volume = newVolume
}

const Player = (player: MprisPlayer) => {
  const artist = Widget.Label({ css: `color: rgba(255, 255, 255, 0.8);`, halign: Align.START }).hook(
    player,
    (label) => {
      label.label = player.track_artists[0]
    },
  )
  const title = Widget.Label({ halign: Align.START }).hook(player, (label) => {
    label.label = player.track_title
  })

  const titleAndArtist = Widget.Box({
    valign: Align.CENTER,
    orientation: Orientation.VERTICAL,
    children: [title, artist],
  })
  const playPauseIcon = Icon('play').hook(player, (icon) => {
    icon.icon = player.play_back_status === 'Playing' ? 'f-pause' : 'f-play'
  })

  return TransparentButton({
    css: MusicColor.bind('value').as(
      ({ color }) => `background: ${color}; font-size: 10px; padding: 0px; padding-left: 12px;`,
    ),
    onClicked: () => player.playPause(),
    onScrollUp: () => changeSpotifyVolume(true),
    onScrollDown: () => changeSpotifyVolume(false),
    child: Row(
      player.bind('track_cover_url').as((coverUrl) => [playPauseIcon, titleAndArtist, SongArt(coverUrl)]),
      { spacing: 12 },
    ),
  })
}

export default function Music() {
  return Section(
    [
      Widget.Box({
        children: mpris
          .bind('players')
          .as((p) => p.filter((player) => player.name === 'spotify').map(Player)),
      }),
    ],
    { margin: 0 },
  )
}
