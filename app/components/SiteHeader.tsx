import Link from 'next/link'

export default function SiteHeader({ trail }: { trail?: { href: string; label: string } }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2.5 font-sans text-[14px] leading-5 text-label">
      <Link href="/" className="flex items-center gap-2.5 hover:text-ink hover:no-underline">
        <img src="/avatar-192.webp" alt="" width={24} height={24} className="frame size-6 rounded-md" decoding="async" />
        Yaz Caleb
      </Link>
      {trail && (
        <>
          <span aria-hidden="true">/</span>
          <Link href={trail.href} className="hover:text-ink hover:no-underline">{trail.label}</Link>
        </>
      )}
    </nav>
  )
}
