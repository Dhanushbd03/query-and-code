import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border  px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-950 placeholder:text-ctp-text focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ctp-flamingo focus-visible:ring-offset-2 focus-visible:ring-offset-ctp-flamingo disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-ctp-base hover:ring-2 hover:ring-ctp-flamingo/5 focus:border-ctp-flamingo transition-all ",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
