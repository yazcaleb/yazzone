# yazzone

Personal site at [yaz.md](https://yaz.md).

## Philosophy

Zero client-side JavaScript for theme switching. Dark mode respects `prefers-color-scheme` because your OS already knows what you want. No hydration tax, no flash of wrong theme, no localStorage hacks.

The whole thing is statically generated. Images are native `<img>` tags with proper `width`/`height` to prevent layout shift. CSS handles the tabs, dropdowns, and transitions. The browser is good at this stuff when you let it be.

~87kB first load. Could be smaller but I like fonts.

## Stack

- Next.js 14 (App Router, static export)
- Tailwind CSS
- MDX for essays
- No analytics, no cookies, no tracking

Fork it, break it, make it yours.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Running Locally

To get started, you'll need to have [pnpm](https://pnpm.io/installation) installed.

1.  Clone the repository:
    ```bash
    git clone https://github.com/plawlost/yazzone.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd yazzone
    ```
3.  Install dependencies:
    ```bash
    pnpm install
    ```
4.  Run the development server:
    ```bash
    pnpm dev
    ```

Your site should now be running at [http://localhost:3000](http://localhost:3000).
