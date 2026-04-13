import * as React from "react"
import SVG, { G, Path, Svg, SvgProps } from "react-native-svg"

const FilterIcon = (props: SvgProps) => (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 24 24"
      {...props}
    >
      <Path
        fill="none"
        stroke={props.color}
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 100-4.36 2.18 2.18 0 000 4.36zm-9.25 6.607a2.18 2.18 0 100-4.36 2.18 2.18 0 000 4.36zm6.607 6.608a2.18 2.18 0 100-4.361 2.18 2.18 0 000 4.36z"
      />
    </Svg>
)

export default FilterIcon