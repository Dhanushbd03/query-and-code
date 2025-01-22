import logo from "@/assets/logo.png";
type Props = {}

const Logo = (props: Props) => {
  return (
    <div>
        <img src={logo} alt="Query and code" className="h-28 filter invert" />
    </div>
  )
}
export default Logo;