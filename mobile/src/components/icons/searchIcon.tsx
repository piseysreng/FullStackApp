import * as React from "react"
import SVG, { G, Path, Svg, SvgProps } from "react-native-svg"

const SearchIcon = (props: SvgProps) => (
    <Svg
      width={props.width}
      height={props.height}
      viewBox="0 0 24 24"
      {...props}
    >
      <Path
        fill={props.color}
        d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7-.7.275-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5 6.313 6.313 5 9.5t1.313 3.188T9.5 14"
      />
    </Svg>
)

export default SearchIcon