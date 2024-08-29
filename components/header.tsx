import * as React from 'react'
import Link from 'next/link'

import { auth } from '@/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconSeparator,
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'

async function UserOrLogin() {
  const session = (await auth()) as Session
  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
          <img src="https://0d961d89e155367edcbf3d4a60ed34df.cdn.bubble.io/f1721056013711x776624810310451000/Frame%20313.svg" alt="Icon" className="mx-auto w-10 h-10" />
      )}
      <div className="flex items-center">
        <IconSeparator className="size-6 text-muted-foreground/50" />
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <span className="font-bold italic">Umi Care with AI Doctor</span>
        )}
      </div>
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex items-center space-x-2">
          <Button variant="link" asChild className="font-bold">
            <Link href="/new">Home</Link>
          </Button>
          <Button variant="link" asChild className="font-bold">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
