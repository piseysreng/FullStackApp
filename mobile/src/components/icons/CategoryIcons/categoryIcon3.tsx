import * as React from "react"
import SVG, { Circle, ClipPath, Defs, G, Path, Svg, SvgProps } from "react-native-svg"

const CategoryIcon3 = (props: SvgProps) => (
    <Svg
      width={52}
      height={52}
      viewBox="0 0 52 52"
      fill="none"
      {...props}
    >
      <Circle cx={26} cy={26} r={26} fill="#FFF6E3" />
      <G clipPath="url(#clip0_0_1)" fill="#F5BA3C">
        <Path d="M35.648 16.656h-3.92l.373-2.133h1.415a.762.762 0 100-1.523H31.46a.762.762 0 00-.75.63l-.53 3.026H16.35a.762.762 0 00-.761.762v3.656c0 .42.34.762.762.762h1.294l.513 4.206c3.284.75 3.84 2.802 7.841 2.802 3.994 0 4.565-2.052 7.84-2.803.11-.89.405-3.314.514-4.205h1.294c.421 0 .762-.341.762-.762v-3.656a.762.762 0 00-.762-.762z" />
        <Path d="M26 30.367c-4.154 0-5.22-1.927-7.642-2.695l.929 7.612.37 3.047c.047.382.372.67.757.67h11.172c.385 0 .71-.288.756-.67l.125-1.023 1.175-9.637c-2.418.768-3.488 2.696-7.642 2.696zm4.911 7.11H21.09l-.186-1.524h10.194l-.186 1.524z" />
      </G>
      <Defs>
        <ClipPath id="clip0_0_1">
          <Path fill="#fff" transform="translate(13 13)" d="M0 0H26V26H0z" />
        </ClipPath>
      </Defs>
    </Svg>
)

export default CategoryIcon3