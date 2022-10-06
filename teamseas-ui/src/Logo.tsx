import {
  chakra,
  keyframes,
  ImageProps,
  forwardRef,
} from "@chakra-ui/react"
import logo from './TeamSeasLogo.png';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const Logo = forwardRef<ImageProps, "img">((props, ref) => {
  return <chakra.img src={logo} ref={ref} {...props} />
})
