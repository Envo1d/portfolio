import { forwardRef, type AnchorHTMLAttributes } from 'react'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ href, ...props }, ref) => (
  <a ref={ref} href={href.startsWith('/') ? `#${href === '/' ? '/team' : href}` : href} {...props} />
))

export default Link
