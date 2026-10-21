import { Navbar } from "@/components/site/Navbar";

// Placeholder home page for the setup milestone: proves fonts, tokens and both themes.
// The real sections (Hero, Services, Album, …) come in milestone 2.
export default function Home() {
  return (
    <>
      <Navbar />
      <main id="top">
        <section className="on-band relative flex min-h-[70vh] items-center overflow-hidden bg-hero text-on-band">
          <div
            aria-hidden="true"
            className="hero-reel absolute inset-y-0 right-0 w-full opacity-35 md:w-[60%] md:opacity-50"
          />
          <div className="relative mx-auto w-full max-w-[1280px] px-4 py-24 md:px-10">
            <p className="type-meta text-on-band-muted">
              <span className="text-tally">●</span>&nbsp; REC · UNC BIDYO · Photo &amp; video coverage
            </p>
            <h1 className="type-display mt-4 max-w-[12ch] text-[56px] md:text-[104px]">
              Capturing the moments of every <em className="hero-em">UNCean.</em>
            </h1>
            <p className="type-body-lg mt-6 max-w-[46ch] text-on-band-muted">
              Photo and video coverage for UNC organizations, faculty and students. Tell us about your event, propose
              your rate, and we&apos;ll take it from there.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#book" className="inline-flex h-12 items-center rounded-pill bg-primary px-6 type-label text-on-primary hover:bg-primary-hover">
                Book a shoot →
              </a>
              <span className="type-meta text-on-band-muted">Submit at least 7 days before your event</span>
            </div>
          </div>
        </section>

        <section className="on-band bg-band text-on-band">
          <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-8 md:px-10">
            <span className="type-h1">5+</span>
            <span className="type-meta text-on-band-muted">organizations have booked BIDYO</span>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 py-16 md:px-10 md:py-[120px]">
          <p className="type-label text-text-muted">Setup check</p>
          <h2 className="type-h1 mt-2">
            Site <em className="text-accent">scaffold</em> is live.
          </h2>
          <p className="type-body mt-4 max-w-[60ch] text-text-muted">
            Fonts, design tokens and light/dark mode are wired. Sections from the wireframe are built next.
          </p>
        </section>
      </main>
    </>
  );
}
