import React from 'react'

import { cn } from '@/lib/utils'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      <img src="https://0d961d89e155367edcbf3d4a60ed34df.cdn.bubble.io/f1721051365215x710909838056503600/Powered%20by%20UmiCare.svg" alt="Umi Care" className="mx-auto w-1/6 mb-4" />
    </p>
  )
}
