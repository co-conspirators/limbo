import { Icon, Row, Section, TransparentButton } from 'src/components'
import allConfig from 'src/config'
import { cacheDir } from 'src/utils/env'
import { exists } from 'src/utils/fs'
import cairo from 'types/@girs/cairo-1.0/cairo-1.0'

const config = allConfig.bar.twitch

// TODO: tooltip with full info
export function TwitchPfp(name: string) {
  const image = `${cacheDir}/twitch-pfp/${name}.png`

  return TransparentButton({
    css: `padding: 6px 0px 2px 8px;`,
    onPrimaryClick: () => Utils.execAsync(`xdg-open https://twitch.tv/${name}`),
    child: Widget.DrawingArea({
      widthRequest: 20,
      heightRequest: 20,
      /** Draws a circular image */
      drawFn: (_, cr, w, h) => {
        const imageSurfaceFn = image.endsWith('.png')
          ? cairo.ImageSurface.createFromPNG
          : image.endsWith('.jpg') || image.endsWith('.jpeg')
            ? cairo.ImageSurface.createFromJPEG
            : undefined
        if (!imageSurfaceFn) {
          throw Error(`Unsupported image format: ${image}`)
        }
        const imageSurface = imageSurfaceFn(image)

        // Get the dimensions of the original image
        const imgWidth = imageSurface.getWidth()
        const imgHeight = imageSurface.getHeight()
        const radius = Math.min(imgWidth, imgHeight) / 2

        // Calculate the scale factor to fit the image within the destination surface
        const scaleFactor = Math.min(w / imgWidth, h / imgHeight)

        // Set the transformation matrix to scale the image
        cr.scale(scaleFactor, scaleFactor)

        cr.setSourceSurface(imageSurface, 0, 0)
        cr.arc(imgWidth / 2, imgHeight / 2, radius, 0, Math.PI * 2)
        cr.clip()
        cr.paint()
      },
    }),
  })
}

export default function Twitch() {
  const { clientId, clientSecret, channels: allowedChannels } = config
  const appAccessTokenPromise = Utils.fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
  })
    .then((res) => res.json())
    .then((json) => json.access_token)

  const makeRequest = async (path: string) => {
    const appAccessToken = await appAccessTokenPromise
    return Utils.fetch(`https://api.twitch.tv/helix/${path}`, {
      headers: {
        'Client-ID': clientId,
        Authorization: `Bearer ${appAccessToken}`,
      },
    }).then((res) =>
      res.ok ? res.json().then((res) => res.data) : res.text().then((res) => Promise.reject(res)),
    )
  }

  const channelsRow = Row([], { spacing: 0 }).poll(60_000, async () => {
    try {
      const channels = await makeRequest(`streams?user_login=${allowedChannels.join('&user_login=')}`)

      // Download PFPs to /tmp/ags/twitch-pfp/${channel}.png
      for (const channel of channels) {
        const pfpPath = `${cacheDir}/twitch-pfp/${channel.user_name}.png`
        if (await exists(pfpPath)) continue

        const user = await makeRequest(`users?login=${channel.user_name}`).then((users) => users[0])

        await Utils.execAsync(`curl --create-dirs -o ${pfpPath} ${user.profile_image_url}`)
      }

      channelsRow.children = channels.map((channel) => TwitchPfp(channel.user_name))
    } catch (err) {
      console.error(err)
    }
  })

  return Section([Icon(config.icon), channelsRow], { spacing: 4 })
}
