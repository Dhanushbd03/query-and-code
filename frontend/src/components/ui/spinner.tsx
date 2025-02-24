import { miyagi } from "ldrs";

interface Props {
  size?: string;
  stroke?: string;
  speed?: string;
  color?: string;
  className?: string;
}
const spinner = ({
  size = "35",
  stroke = "3.5",
  speed = "0.9",
  color = "black",
  className,
}: Props) => {
  miyagi.register();
  return (
    <div
      className={`flex justify-center items-center absolute top-0 left-0 bg-white bg-opacity-10 z-50 ${className}`}
    >
      <l-miyagi
        size={size}
        stroke={stroke}
        speed={speed}
        color={color}
      ></l-miyagi>
    </div>
  );
};

export default spinner;
