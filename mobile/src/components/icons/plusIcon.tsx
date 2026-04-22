
import * as React from "react"
import SVG, { G, Path, Svg, SvgProps } from "react-native-svg"

const PlusIcon = (props: SvgProps) => (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <Path fill="#6CC51D" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
    </Svg>
)

export default PlusIcon