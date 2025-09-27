import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
  return (
    <img
      src="/icons/logo.png" // place your svg/png file in public/ directory
      alt="Logo"
      className={cn('h-12 w-auto', className)}
    />
  )
}

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <img
      src="/icons/logo.png"
      alt="Logo Icon"
      className={cn('size-12', className)}
    />
  )
}

export const LogoStroke = ({ className }: { className?: string }) => {
  return (
    <img
      src="/icons/logo.png"
      alt="Logo Stroke"
      className={cn('w-10 h-10', className)}
    />
  )
}
