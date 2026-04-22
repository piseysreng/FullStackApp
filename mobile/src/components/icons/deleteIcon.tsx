import * as React from "react"
import SVG, { G, Path, Svg, SvgProps } from "react-native-svg"

const DeleteIcon = (props: SvgProps) => (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      {...props}
    >
      <Path
        fill="#bf0a0a"
        d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
      />
    </Svg>
)

export default DeleteIcon