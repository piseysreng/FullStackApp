import * as React from "react"
import Svg, { Path } from "react-native-svg"

export function HomeIcon(props: any) {
  return (
    <Svg
      fill={props.color}
      height={props.height}
      width={props.width}
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" {...props}>
      <Path d="M341.8 72.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1C71.1 327.9 82.8 336 96 336h16v176c0 35.3 28.7 64 64 64h288c35.3 0 64-28.7 64-64V336h16c13.2 0 25-8.1 29.8-20.3 4.8-12.2 1.6-26.2-8-35.1l-224-208zM304 384h32c26.5 0 48 21.5 48 48v96H256v-96c0-26.5 21.5-48 48-48z" />
    </Svg>
  )
}

export function OrderIcon(props: any) {
  return (
    <Svg
      fill={props.color}
      height={props.height}
      width={props.width}
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" {...props}>
      <Path d="M94.7 136.3c6.9-23.9 28.8-40.3 53.7-40.3h344c24.9 0 46.8 16.4 53.8 40.3l23.4 80.2c12.8 43.7-20.1 87.5-65.6 87.5-26.3 0-49.4-14.9-60.8-37.1-11.6 21.9-34.6 37.1-61.4 37.1-26.6 0-49.7-15-61.3-37-11.6 22-34.7 37-61.3 37-26.8 0-49.8-15.1-61.4-37.1C186.4 289 163.3 304 137 304c-45.6 0-78.4-43.7-65.6-87.5l23.3-80.2zM160.4 416h320v-66.4c7.6 1.6 15.5 2.4 23.5 2.4 14.3 0 28-2.6 40.5-7.2V496c0 26.5-21.5 48-48 48h-352c-26.5 0-48-21.5-48-48V344.8c12.5 4.6 26.1 7.2 40.5 7.2 8.1 0 15.9-.8 23.5-2.4V416z" />
    </Svg>
  )
}

export function CartIcon(props: any) {
  return (
    <Svg
      fill={props.color}
      height={props.height}
      width={props.width}
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" {...props}>
      <Path d="M320 64c6.6 0 12.9 2.7 17.4 7.5l144 152 .5.5H560c17.7 0 32 14.3 32 32 0 14.5-9.6 26.7-22.8 30.7l-46.1 207.2c-6.5 29.3-32.5 50.1-62.5 50.1H179.3c-30 0-56-20.8-62.5-50.1l-46-207.2C57.6 282.8 48 270.5 48 256c0-17.7 14.3-32 32-32h78.1l.5-.5 144-152c4.5-4.8 10.8-7.5 17.4-7.5zm0 58.9L224.2 224h191.6L320 122.9zM240 328c0-13.3-10.7-24-24-24s-24 10.7-24 24v112c0 13.3 10.7 24 24 24s24-10.7 24-24V328zm80-24c-13.3 0-24 10.7-24 24v112c0 13.3 10.7 24 24 24s24-10.7 24-24V328c0-13.3-10.7-24-24-24zm128 24c0-13.3-10.7-24-24-24s-24 10.7-24 24v112c0 13.3 10.7 24 24 24s24-10.7 24-24V328z" />
    </Svg>
  )
}

export function MoreIcon(props: any) {
  return (
    <Svg
      fill={props.color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      height={props.height}
      width={props.width}
      {...props}
    >
      <Path d="M340-540H200q-33 0-56.5-23.5T120-620v-140q0-33 23.5-56.5T200-840h140q33 0 56.5 23.5T420-760v140q0 33-23.5 56.5T340-540zm-140-80h140v-140H200v140zm140 500H200q-33 0-56.5-23.5T120-200v-140q0-33 23.5-56.5T200-420h140q33 0 56.5 23.5T420-340v140q0 33-23.5 56.5T340-120zm-140-80h140v-140H200v140zm560-340H620q-33 0-56.5-23.5T540-620v-140q0-33 23.5-56.5T620-840h140q33 0 56.5 23.5T840-760v140q0 33-23.5 56.5T760-540zm-140-80h140v-140H620v140zm140 500H620q-33 0-56.5-23.5T540-200v-140q0-33 23.5-56.5T620-420h140q33 0 56.5 23.5T840-340v140q0 33-23.5 56.5T760-120zm-140-80h140v-140H620v140zM340-620zm0 280zm280-280zm0 280z" />
    </Svg>
  )
}

export function SearchIcon(props: any) {
  return (
    <Svg
      width={props.width}
      height={props.height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={props.color}
      {...props}
    >
      <Path d="M11 2c4.968 0 9 4.032 9 9s-4.032 9-9 9-9-4.032-9-9 4.032-9 9-9zm0 16c3.867 0 7-3.133 7-7s-3.133-7-7-7-7 3.133-7 7 3.133 7 7 7zm8.485.071l2.829 2.828-1.415 1.415-2.828-2.829 1.414-1.414z" />
    </Svg>
  )
}

export function PlusIcon(props: any) {
  return (
    <Svg
      fill={props.color}
      width={props.width}
      height={props.height}
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" {...props}>
      <Path d="M160 96c-35.3 0-64 28.7-64 64v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H160zm136 312v-64h-64c-13.3 0-24-10.7-24-24s10.7-24 24-24h64v-64c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24h-64v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
    </Svg>
  )
}
