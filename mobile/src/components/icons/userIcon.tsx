import * as React from "react"
import SVG, { G, Path, Svg, SvgProps } from "react-native-svg"

const UserIcon = (props: SvgProps) => (
    <Svg
      width={50}
      height={50}
      viewBox="0 0 24 24"
      {...props}
    >
      <Path 
        fill={props.color}
        d="M11.5 14c4.14 0 7.5 1.57 7.5 3.5V20H4v-2.5c0-1.93 3.36-3.5 7.5-3.5m6.5 3.5c0-1.38-2.91-2.5-6.5-2.5S5 16.12 5 17.5V19h13zM11.5 5A3.5 3.5 0 0115 8.5a3.5 3.5 0 01-3.5 3.5A3.5 3.5 0 018 8.5 3.5 3.5 0 0111.5 5m0 1A2.5 2.5 0 009 8.5a2.5 2.5 0 002.5 2.5A2.5 2.5 0 0014 8.5 2.5 2.5 0 0011.5 6" />
    </Svg>
)

export default UserIcon