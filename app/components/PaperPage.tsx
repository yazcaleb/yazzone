'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const PaperTexture = dynamic(
  () => import('@paper-design/shaders-react').then((m) => m.PaperTexture),
  { ssr: false }
)

export default function PaperPage({ src, darkSrc, alt }: { src: string; darkSrc: string; alt: string }) {
  const [scheme, setScheme] = useState<'light' | 'dark'>()

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => setScheme(query.matches ? 'dark' : 'light')
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return (
    <div className="frame lift relative aspect-[720/569] w-full overflow-hidden rounded-[3px] bg-paper">
      <picture>
        <source srcSet={darkSrc} media="(prefers-color-scheme: dark)" />
        <img
          src={src}
          alt={alt}
          width={1080}
          height={853}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </picture>
      {scheme && (
        <PaperTexture
          key={scheme}
          image={scheme === 'dark' ? darkSrc : src}
          fit="cover"
          colorBack="#ffffff"
          colorPaper="#ffffff"
          colorShadow="#c9c7c1"
          blending={0.35}
          distortion={0.02}
          roughness={0.22}
          roughnessSize={0.35}
          fiber={0.18}
          fiberSize={0.35}
          folds={0.12}
          foldSizeX={0.9}
          foldSizeY={1}
          wrinkles={0}
          crumples={0}
          drops={0}
          angle={300}
          seed={11}
          scale={1.02}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
