"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Target } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Find Outfitters" },
  { href: "/outfitters", label: "Browse Guides" },
  { href: "/gear", label: "Gear" },
  { href: "/list", label: "List Your Hunt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open ? "glass-dark shadow-lg shadow-black/30" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}>
              <Target size={16} color="white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Hunt<span style={{ color: "#E8763A" }}>Hive</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "text-orange-400 bg-orange-500/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                style={pathname === link.href ? { color: "#E8763A" } : {}}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/signin" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/list" className="btn-orange px-5 py-2 text-sm">
              <span>List Your Hunt</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 py-3 px-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                pathname === link.href
                  ? "text-orange-400 bg-orange-500/10"
                  : "text-gray-300"
              }`}
              style={pathname === link.href ? { color: "#E8763A" } : {}}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-white/5 mt-2">
            <Link href="/signin" onClick={() => setOpen(false)}
              className="w-full px-4 py-2.5 text-sm font-medium text-gray-300 rounded-lg border border-white/10 text-center">
              Sign In
            </Link>
            <Link href="/list" onClick={() => setOpen(false)} className="btn-orange w-full py-2.5 text-sm text-center">
              <span>List Your Hunt</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
