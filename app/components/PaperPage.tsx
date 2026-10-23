'use client'

import dynamic from 'next/dynamic'

const PaperTexture = dynamic(
  () => import('@paper-design/shaders-react').then((m) => m.PaperTexture),
  { ssr: false }
)

export default function PaperPage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[720/569] w-full overflow-hidden rounded-[3px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.07)]">
      <img
        src={src}
        alt={alt}
        width={1080}
        height={853}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <PaperTexture
        image={src}
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
        scale={1}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
    </div>
  )
}
