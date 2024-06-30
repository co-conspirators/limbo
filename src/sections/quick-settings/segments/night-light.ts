import { TransparentButton, mouseCommandsToButtonProps } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'
import SunCalc from 'suncalc'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.nightLight

enum StateEnum {
  Off = 'off',
  On = 'on',
  Forced = 'forced',
}
const State = Variable<StateEnum>(StateEnum.On)
const Temp = Variable(6500)

const setTemp = (temp: number) => {
  Utils.execAsync(
    `busctl --user set-property rs.wl-gammarelay / rs.wl.gammarelay Temperature q ${Math.round(temp)}`,
  )
  Temp.setValue(temp)
}

const updateGammaRelay = async () => {
  const state = State.getValue()
  if (state === StateEnum.Off) return setTemp(config.dayTemp)
  if (state === StateEnum.Forced) return setTemp(config.nightTemp)

  const now = new Date()
  const { sunset, sunrise } = SunCalc.getTimes(now, allConfig.general.lat, allConfig.general.lon)

  if (now > sunset) {
    const minutesSinceSunset = (now.getTime() - sunset.getTime()) / 60000
    const sunsetWeight = Math.min(1, Math.max(0, minutesSinceSunset / config.fadeDurationMinutes))

    const temp = config.dayTemp * (1 - sunsetWeight) + config.nightTemp * sunsetWeight
    return setTemp(temp)
  }

  if (now > sunrise) {
    const minutesSinceSunrise = (now.getTime() - sunrise.getTime()) / 60000
    const sunriseWeight = Math.min(1, Math.max(0, minutesSinceSunrise / config.fadeDurationMinutes))

    const temp = config.nightTemp * (1 - sunriseWeight) + config.dayTemp * sunriseWeight
    return setTemp(temp)
  }

  return setTemp(config.nightTemp)
}

export default function NightLight() {
  const IconConfig = State.bind('value').as((state) => {
    if (state === StateEnum.Off) return config.offIcon
    if (state === StateEnum.On) return config.onIcon
    if (state === StateEnum.Forced) return config.forcedIcon
    throw new Error('Invalid state')
  })
  const icon = Icon({
    name: IconConfig.as((c) => c.name),
    color: IconConfig.as((c) => c.color),
  }).hook(Temp, (icon) => {
    icon.tooltip_markup = `${Temp.getValue()}K`
  })

  return TransparentButton({
    child: icon,
    onClicked: () => {
      const state = State.getValue()
      if (state === StateEnum.Off) State.setValue(StateEnum.On)
      else if (state === StateEnum.On) State.setValue(StateEnum.Forced)
      else if (state === StateEnum.Forced) State.setValue(StateEnum.Off)
      else throw new Error('Invalid state')
    },
    ...mouseCommandsToButtonProps(config),
    ...buttonProps,
  })
    .poll(30_000, updateGammaRelay)
    .hook(State, updateGammaRelay)
}

// ------------------
// Import necessary types if needed
interface SunTimes {
  sunrise: Date
  sunset: Date
}

// Constants and helper functions from the original code
const dayMs = 1000 * 60 * 60 * 24
const J1970 = 2440588
const J2000 = 2451545
const rad = Math.PI / 180

function toJulian(date: Date): number {
  return date.valueOf() / dayMs - 0.5 + J1970
}

function fromJulian(j: number): Date {
  return new Date((j + 0.5 - J1970) * dayMs)
}

function toDays(date: Date): number {
  return toJulian(date) - J2000
}

function solarMeanAnomaly(d: number): number {
  return rad * (357.5291 + 0.98560028 * d)
}

function eclipticLongitude(M: number): number {
  const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M))
  const P = rad * 102.9372
  return M + C + P + Math.PI
}

function sunCoords(d: number): { dec: number; ra: number } {
  const M = solarMeanAnomaly(d)
  const L = eclipticLongitude(M)
  const e = rad * 23.4397
  const dec = Math.asin(Math.sin(L) * Math.cos(e) + Math.cos(L) * Math.sin(e) * Math.sin(0))
  const ra = Math.atan2(Math.sin(L) * Math.cos(e) - Math.tan(0) * Math.sin(e), Math.cos(L))
  return { dec, ra }
}

function hourAngle(h: number, phi: number, dec: number): number {
  return Math.acos((Math.sin(h) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)))
}

function getSetJ(h: number, lw: number, phi: number, dec: number, n: number, M: number, L: number): number {
  const w = hourAngle(h, phi, dec)
  const a = approxTransit(w, lw, n)
  return solarTransitJ(a, M, L)
}

function approxTransit(Ht: number, lw: number, n: number): number {
  return 0.0009 + (Ht + lw) / (2 * Math.PI) + n
}

function solarTransitJ(ds: number, M: number, L: number): number {
  return J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L)
}

function julianCycle(d: number, lw: number): number {
  return Math.round(d - 0.0009 - lw / (2 * Math.PI))
}

function observerAngle(height: number): number {
  return (-2.076 * Math.sqrt(height)) / 60
}

// Main function to get sunrise and sunset times
function getSunTimes(date: Date, lat: number, lng: number, height: number = 0): SunTimes {
  const lw = rad * -lng
  const phi = rad * lat
  const dh = observerAngle(height)
  const d = toDays(date)
  const n = julianCycle(d, lw)
  const ds = approxTransit(0, lw, n)
  const M = solarMeanAnomaly(ds)
  const L = eclipticLongitude(M)
  const dec = sunCoords(d).dec
  const Jnoon = solarTransitJ(ds, M, L)

  const h0 = (-0.833 + dh) * rad
  const Jset = getSetJ(h0, lw, phi, dec, n, M, L)
  const Jrise = Jnoon - (Jset - Jnoon)

  return {
    sunrise: fromJulian(Jrise),
    sunset: fromJulian(Jset),
  }
}
