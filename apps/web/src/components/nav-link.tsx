'use client'

import { ComponentProps } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavLinkProps = ComponentProps<typeof Link> & {
  shouldMatchExact?: boolean
}

export function NavLink({ shouldMatchExact = false, ...props }: NavLinkProps) {
  const pathName = usePathname()

  const isCurrent =
    props.href === '/' || shouldMatchExact
      ? pathName === props.href
      : pathName.startsWith(props.href.toString())

  return <Link {...props} prefetch={false} data-current={isCurrent} />
}