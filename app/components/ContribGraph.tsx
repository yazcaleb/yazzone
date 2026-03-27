const CELL = 7
const GAP = 2
const STEP = CELL + GAP
const START_MONTH = 10 // 0-indexed: 10 = November

function level(count: number): string {
  if (count <= 0) return 'var(--cg-empty)'
  if (count <= 4) return 'var(--cg-l1)'
  if (count <= 14) return 'var(--cg-l2)'
  if (count <= 35) return 'var(--cg-l3)'
  return 'var(--cg-l4)'
}

async function fetchRange(from: string, to: string): Promise<Record<string, number>> {
  const token = process.env.GITHUB_TOKEN
  if (!token) return {}

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        user(login: "yazcaleb") {
          contributionsCollection(from: "${from}", to: "${to}") {
            contributionCalendar {
              weeks {
                contributionDays { date contributionCount }
              }
            }
          }
        }
      }`,
    }),
    next: { revalidate: 86400 },
  })

  if (!res.ok) return {}
  const data = await res.json()
  const weeks =
    data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []

  const map: Record<string, number> = {}
  for (const week of weeks)
    for (const day of week.contributionDays)
      map[day.date] = day.contributionCount

  return map
}

export default async function ContribGraph() {
  const year = new Date().getFullYear()
  const prevYear = year - 1

  // Two queries: Nov-Dec of previous year + full current year (API limits to 1-year spans)
  const [prevContribs, currContribs] = await Promise.all([
    fetchRange(`${prevYear}-${START_MONTH + 1}-01T00:00:00Z`, `${prevYear}-12-31T23:59:59Z`),
    fetchRange(`${year}-01-01T00:00:00Z`, `${year}-12-31T23:59:59Z`),
  ])

  const contribs = { ...prevContribs, ...currContribs }
  if (!Object.keys(contribs).length) return null

  // Grid starts on the Sunday on or before Nov 1 of previous year
  const nov1 = new Date(Date.UTC(prevYear, START_MONTH, 1))
  const gridStart = new Date(nov1)
  gridStart.setUTCDate(gridStart.getUTCDate() - nov1.getUTCDay())

  // Grid ends at Dec 31 of current year (+ padding to complete the week)
  const dec31 = new Date(Date.UTC(year, 11, 31))
  const gridEnd = new Date(dec31)
  gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - dec31.getUTCDay()))

  const totalDays = Math.round((gridEnd.getTime() - gridStart.getTime()) / 86400000) + 1
  const totalWeeks = Math.ceil(totalDays / 7)

  const cols: { date: string; count: number; inRange: boolean }[][] = []
  const cur = new Date(gridStart)

  for (let w = 0; w < totalWeeks; w++) {
    const col: { date: string; count: number; inRange: boolean }[] = []
    for (let d = 0; d < 7; d++) {
      const dateStr = cur.toISOString().slice(0, 10)
      const inRange = cur >= nov1 && cur <= dec31
      col.push({ date: dateStr, count: contribs[dateStr] ?? 0, inRange })
      cur.setUTCDate(cur.getUTCDate() + 1)
    }
    cols.push(col)
  }

  const W = totalWeeks * STEP - GAP
  const H = 7 * STEP - GAP

  return (
    <div
      className="mb-2"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        className="w-full h-auto"
        aria-hidden="true"
      >
        {cols.map((col, wi) =>
          col.map((day, di) => (
            <rect
              key={day.date}
              x={wi * STEP}
              y={di * STEP}
              width={CELL}
              height={CELL}
              rx={0.5}
              fill={day.inRange ? level(day.count) : 'transparent'}
            />
          ))
        )}
      </svg>
    </div>
  )
}
