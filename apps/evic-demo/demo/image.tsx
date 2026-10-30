import type { ImgHTMLAttributes } from 'react'

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }

export default function Image({ src, fill, priority, style, ...props }: ImageProps) {
  const localSrc = src?.startsWith('/') ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src

  return (
    <img
      {...props}
      src={localSrc}
      style={fill ? { position: 'absolute', width: '100%', height: '100%', inset: 0, ...style } : style}
    />
  )
}
