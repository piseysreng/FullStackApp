import * as React from "react"
import SVG, { Defs, G, Path, Svg, SvgProps, Use } from "react-native-svg"

const ArrowRightIcon = (props: SvgProps) => (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 12 24"
      {...props}
    >
      <Defs>
        <Path
          id="a"
          fill={props.color}
          d="M7.588 12.43l-1.061 1.06L.748 7.713a.996.996 0 010-1.413L6.527.52l1.06 1.06-5.424 5.425z"
        />
      </Defs>
      <Use fillRule="evenodd" href="#a" transform="rotate(-180 5.02 9.505)" />
    </Svg>
)

export default ArrowRightIcon