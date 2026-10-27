'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { api } from '@/lib/api';

const links = [
  { label: 'Our story', href: '/#story' },
  { label: 'The menu', href: '/menu' },
  { label: 'Reservations', href: '/reservation' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    api.getMe().then((result) => {
      if (result && result.user) setUser(result.user);
    }).catch(() => {});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={'site-nav ' + (scrolled ? 'site-nav--scrolled' : '')}>
      <div className="site-nav__inner page-shell">
        <Link href="/" className="site-brand" onClick={closeMenu} aria-label="Lumière home">
          <span className="site-brand__mark">L<span>✳</span></span>
          <span className="site-brand__name">LUMIÈRE<small>THE EVERYDAY TABLE</small></span>
        </Link>
        <nav className="site-nav__links" aria-label="Main navigation">
          {links.map((link) => <Link href={link.href} key={link.label}>{link.label}</Link>)}
          <Link href="/track-order">Track your order</Link>
        </nav>
        <div className="site-nav__actions">
          <Link href="/login" className="site-account" aria-label={user ? 'Account for ' + user.name : 'Sign in'}>
            <UserRound size={16} /><span>{user ? user.name.split(' ')[0] : 'Sign in'}</span>
          </Link>
          <Link href="/cart" className="site-bag" aria-label={'Shopping bag with ' + itemCount + ' items'}>
            <ShoppingBag size={17} /><span className="site-bag__label">Your bag</span>
            {itemCount > 0 && <span className="site-bag__count">{itemCount}</span>}
          </Link>
        </div>
        <button className="site-nav__toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="site-nav__mobile" aria-label="Mobile navigation">
          {links.map((link) => <Link href={link.href} key={link.label} onClick={closeMenu}>{link.label}</Link>)}
          <Link href="/track-order" onClick={closeMenu}>Track your order</Link>
          <Link href="/login" onClick={closeMenu}>{user ? 'Your account · ' + user.name : 'Sign in / Create account'}</Link>
          <Link href="/cart" onClick={closeMenu}>Your bag ({itemCount})</Link>
        </nav>
      )}
    </header>
  );
}