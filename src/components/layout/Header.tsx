"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { NavData } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export function Header({ nav }: { nav: NavData }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  // Close everything on navigation (derive-from-props pattern, no effect).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setDropdownOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the desktop dropdown on Escape / outside click.
  useEffect(() => {
    if (!dropdownOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDropdownOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [dropdownOpen]);

  return (
    <header
      className={cn(
        // Opaque on purpose: backdrop-filter would make this header the
        // containing block for the fixed mobile menu panel (height 0).
        "sticky top-0 z-50 bg-paper transition-shadow duration-300",
        scrolled
          ? "border-b border-line-soft shadow-[0_1px_24px_rgba(0,0,0,0.06)]"
          : "border-b border-transparent"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-primary focus:px-4 focus:py-2 focus:text-inverse"
      >
        {nav.a11y.skipToContent}
      </a>

      <div className="mx-auto flex h-[4.25rem] w-full max-w-[88rem] items-center justify-between gap-6 px-6 sm:px-8 md:h-[4.75rem]">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label={nav.name}>
          <Image
            src={nav.logo.src}
            alt={nav.name}
            width={nav.logo.width}
            height={nav.logo.height}
            priority
            unoptimized={nav.logo.src.endsWith(".svg")}
            className="h-9 w-auto md:h-10"
          />
          {/* Text-level anchor for crawlers that ignore alt/aria-label. */}
          <span className="sr-only">{nav.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label={nav.a11y.mainNavigation} className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.95rem] font-medium">
            <li className="relative" ref={dropdownRef}>
              <button
                type="button"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 py-2 transition-colors hover:text-primary",
                  dropdownOpen && "text-primary"
                )}
              >
                {nav.menu.label}
                <Icon
                  name="chevron-down"
                  className={cn("size-3.5 transition-transform duration-200", dropdownOpen && "rotate-180")}
                />
              </button>
              <div
                className={cn(
                  "absolute left-1/2 top-full w-[26rem] -translate-x-1/2 pt-3 transition-all duration-200",
                  dropdownOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-1 opacity-0"
                )}
              >
                <div className="border border-line-soft bg-paper p-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                  <ul className="grid grid-cols-2 gap-0.5">
                    {nav.menu.items.map((item) => (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          className="group flex items-baseline px-3.5 py-3 transition-colors hover:bg-soft"
                        >
                          <span className="transition-colors group-hover:text-primary">
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={nav.menu.href}
                    className="mt-1 flex items-center justify-between border-t border-line-soft px-3.5 py-3 text-sm text-muted transition-colors hover:text-primary"
                  >
                    {nav.menu.viewAllLabel}
                    <Icon name="arrow-right" className="size-4" />
                  </Link>
                </div>
              </div>
            </li>
            {nav.items.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="link-sweep py-2 transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3 md:gap-5">
          <a
            href={nav.phoneHref}
            aria-label={nav.phoneAria}
            className="data hidden items-center gap-2 whitespace-nowrap text-[1.05rem] font-semibold text-primary transition-colors hover:text-accent-ink md:flex"
          >
            <Icon name="phone" className="size-[1.1rem] text-accent" />
            {nav.phoneDisplay}
          </a>
          <Link
            href={{ pathname: "/contact" }}
            className="hidden items-center whitespace-nowrap bg-primary px-5 py-2.5 text-[0.9rem] font-medium text-inverse transition-colors hover:bg-primary-deep sm:inline-flex"
          >
            {nav.cta.label}
          </Link>

          {/* Mobile controls */}
          <a
            href={nav.phoneHref}
            aria-label={nav.phoneAria}
            className="grid size-10 place-items-center border border-line text-primary md:hidden"
          >
            <Icon name="phone" className="size-[1.15rem]" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? nav.a11y.closeMenu : nav.a11y.openMenu}
            className="grid size-10 place-items-center border border-line lg:hidden"
          >
            <Icon name={menuOpen ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu: editorial full-screen panel */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-[4.25rem] z-40 overflow-y-auto bg-paper transition-opacity duration-300 lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {/* Extra bottom padding: the sticky call bar and cookie banner
            overlay the viewport bottom, so the last items need room to
            scroll clear of them. */}
        <nav aria-label={nav.a11y.mainNavigation} className="flex min-h-full flex-col px-6 pb-36 pt-6">
          <details className="group border-b border-line-soft">
            <summary className="flex items-center justify-between py-4 font-display text-2xl font-medium">
              {nav.menu.label}
              <Icon name="chevron-down" className="size-5 text-muted transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <ul className="pb-4">
              {nav.menu.items.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="block py-2.5 pl-4 text-lg text-muted">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={nav.menu.href} className="block py-2.5 pl-4 text-lg text-accent-ink">
                  {nav.menu.viewAllLabel}
                </Link>
              </li>
            </ul>
          </details>
          {nav.items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="border-b border-line-soft py-4 font-display text-2xl font-medium"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={nav.phoneHref}
              className="data inline-flex items-center justify-center gap-2.5 bg-accent px-6 py-4 text-lg font-semibold text-ink"
            >
              <Icon name="phone" className="size-5" />
              {nav.phoneDisplay}
            </a>
            <Link
              href={{ pathname: "/contact" }}
              className="inline-flex items-center justify-center bg-primary px-6 py-4 font-medium text-inverse"
            >
              {nav.cta.label}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
