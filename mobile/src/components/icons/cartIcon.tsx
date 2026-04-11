import * as React from "react"
import SVG, { Circle, G, Path, Svg, SvgProps } from "react-native-svg"

const CartIcon = (props: SvgProps) => (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <G
        fill="none"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <Circle cx={9.549} cy={19.049} r={1.701} />
        <Circle cx={16.96} cy={19.049} r={1.701} />
        <Path d="M5.606 5.555l2.01 6.364c.309.978.463 1.467.76 1.829.26.32.599.567.982.72.435.173.947.173 1.973.173h3.855c1.026 0 1.538 0 1.972-.173.384-.153.722-.4.983-.72.296-.362.45-.851.76-1.829l.409-1.296.24-.766.331-1.05a2.5 2.5 0 00-2.384-3.252zm0 0l-.011-.037a7 7 0 00-.14-.42 2.92 2.92 0 00-2.512-1.84C2.84 3.25 2.727 3.25 2.5 3.25" />
      </G>
    </Svg>
)

export default CartIcon