import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#how", label: "How it works" },
  { href: "#team", label: "Team" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 md:px-10">
        <a href="#top" className="relative block h-12 w-28" aria-label="UNC BIDYO home">
          {/* Square logo files with padding: crop to the wordmark with object-cover */}
          <Image src="/brand/bidyo-logo-color.png" alt="BIDYO" fill sizes="112px" className="logo-light object-cover" priority />
          <Image src="/brand/bidyo-logo-white.png" alt="" fill sizes="112px" className="logo-dark object-cover" priority />
        </a>
        <ul className="hidden items-center gap-6 type-label md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-accent">{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#book"
            className="inline-flex h-10 items-center whitespace-nowrap rounded-pill bg-primary px-4 type-label text-on-primary transition-colors hover:bg-primary-hover md:px-5"
          >
            <span className="md:hidden">Book →</span>
            <span className="hidden md:inline">Book a shoot →</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
