import * as React from "react"
import SVG, { G, Path, Svg, SvgProps } from "react-native-svg"

const MinusIcon = (props: SvgProps) => (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <Path fill="#6CC51D" d="M19 12.998H5v-2h14z" />
    </Svg>
)

export default MinusIcon