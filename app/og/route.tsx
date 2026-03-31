import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const hasTitle = searchParams.has('title')
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'Builder. Founder of Veto and Plaw.'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backgroundColor: '#0a0a0a',
            padding: '60px 80px',
            fontFamily: 'Georgia, serif',
          }}
        >
          {/* Large title - bottom aligned, left */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            }}
          >
            <div
              style={{
                fontSize: hasTitle ? 72 : 80,
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                maxWidth: '1000px',
              }}
            >
              {title}
            </div>
            
            {/* Author line with hand-drawn asterisk */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {/* Hand-drawn asterisk/star mark */}
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M12 2 L12 22 M2 12 L22 12 M4 4 L20 20 M20 4 L4 20"
                  stroke="#525252"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  fontSize: 24,
                  color: '#737373',
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 500,
                }}
              >
                Yaz A. Caleb
              </div>
            </div>
          </div>

          {/* Corner URL */}
          <div
            style={{
              position: 'absolute',
              top: '60px',
              right: '80px',
              fontSize: 20,
              color: '#404040',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            yaz.zone
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
