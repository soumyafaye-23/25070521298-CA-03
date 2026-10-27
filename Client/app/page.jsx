'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { menuItems } from '@/lib/data';
import { api } from '@/lib/api';
import { useCart } from '@/lib/cart-context';

export default function Home() {
  const { addToCart } = useCart();
  const [featuredItems, setFeaturedItems] = useState(menuItems.filter((item) => item.featured));

  useEffect(() => {
    let active = true;
    api.getMenu().then((items) => {
      if (active && items && items.length) {
        const featured = items.filter((item) => item.featured).slice(0, 3);
        if (featured.length) setFeaturedItems(featured);
      }
    });
    return () => { active = false; };
  }, []);

  return (
    <main className="home-page">
      <Navbar />

      <section className="hero">
        <Image
          src="/images/Paneer_Lababdar.webp"
          alt="A rich, slow-simmered paneer curry from the Lumière kitchen"
          fill
          priority
          sizes="100vw"
          className="hero__image"
        />
        <div className="hero__shade" />
        <div className="hero__content page-shell">
          <div className="eyebrow hero__eyebrow"><span /> INDIAN CUISINE, WITH A LITTLE MORE SOUL</div>
          <h1>Make room<br />for <em>something</em><br />beautiful.</h1>
          <p className="hero__intro">
            A thoughtful take on the flavours we grew up with — made slowly, shared generously, remembered long after.
          </p>
          <div className="hero__actions">
            <Link href="/menu" className="button button--warm">Explore the menu <ArrowUpRight size={17} /></Link>
            <Link href="/reservation" className="button button--quiet">Reserve your table <ArrowRight size={16} /></Link>
          </div>
        </div>
        <div className="hero__caption"><span>01 / 03</span><span>FROM OUR KITCHEN, WITH LOVE</span></div>
        <a className="hero__scroll" href="#story" aria-label="Scroll to our story"><ArrowDown size={15} /> SCROLL TO DISCOVER</a>
        <div className="hero__side-note">SEASONAL · LOCAL · ALWAYS MADE WITH CARE</div>
      </section>

      <section className="promise-strip" aria-label="What makes Lumière special">
        <div><span>01</span> Ingredients with a story</div>
        <i />
        <div><span>02</span> Recipes worth slowing down for</div>
        <i />
        <div><span>03</span> A seat saved just for you</div>
      </section>

      <section className="story-section page-shell" id="story">
        <div className="story-section__visual">
          <div className="story-section__photo">
            <Image src="/images/Chole-Bhature-01.jpg" alt="A beloved Indian classic, served fresh at Lumière" fill sizes="(max-width: 800px) 90vw, 48vw" />
          </div>
          <div className="story-note"><span>GOOD FOOD.</span><span>GOOD COMPANY.</span><span>THAT'S THE WHOLE IDEA.</span></div>
        </div>
        <div className="story-section__copy">
          <div className="eyebrow"><span /> THE LUMIÈRE WAY</div>
          <h2>Rooted in memory.<br /><em>Made for today.</em></h2>
          <p>Some flavours take you straight home. We honour those familiar recipes, give every ingredient the time it deserves, and bring them to your table with a fresh point of view.</p>
          <p>Come as you are. Stay a little longer. There’s always room for one more.</p>
          <Link href="/menu" className="text-link">A little more about our menu <ArrowUpRight size={16} /></Link>
          <div className="story-stats">
            <div><strong>12<span>+</span></strong><small>signature dishes</small></div>
            <div><strong>100<span>%</span></strong><small>made with care</small></div>
          </div>
        </div>
      </section>

      <section className="menu-section">
        <div className="page-shell">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span /> A FEW HOUSE FAVOURITES</div>
              <h2>The good stuff.</h2>
            </div>
            <Link href="/menu" className="text-link">See the full menu <ArrowUpRight size={16} /></Link>
          </div>
          <div className="dish-grid">
            {featuredItems.map((item, index) => (
              <article className="dish-card" key={item.id}>
                <Link className="dish-card__image" href="/menu" aria-label={"Explore " + item.name}>
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 700px) 90vw, (max-width: 1000px) 45vw, 30vw" />
                  <span className="dish-card__number">0{index + 1}</span>
                  <span className="dish-card__arrow"><ArrowUpRight size={17} /></span>
                </Link>
                <div className="dish-card__body">
                  <div className="dish-card__meta"><span>{item.category}</span><span>HOUSE FAVOURITE</span></div>
                  <div className="dish-card__title-row"><h3>{item.name}</h3><strong>₹{item.price}</strong></div>
                  <p>{item.description}</p>
                  <Button className="dish-card__add" variant="gold" onClick={() => { addToCart(item); toast.success(item.name + ' added to your bag'); }}>
                    Add to your table <span>+</span>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="visit-section page-shell">
        <div className="visit-card">
          <div className="visit-card__copy">
            <div className="eyebrow"><span /> YOUR TABLE IS WAITING</div>
            <h2>Make an evening<br /><em>of it.</em></h2>
            <p>Good things are better shared in person. Bring your favourite people — we’ll take care of the rest.</p>
            <Link href="/reservation" className="button button--warm">Find your table <ArrowRight size={16} /></Link>
            <div className="visit-details">
              <div><Clock3 size={16} /><span>Make time to gather<br /><b>Lunch or dinner, made for sharing</b></span></div>
              <div><MapPin size={16} /><span>Come find us<br /><b>In the heart of the city</b></span></div>
            </div>
          </div>
          <div className="visit-card__image">
            <Image src="/images/Palak-Paneer-Bhurji-MOP-New.webp" alt="Freshly prepared seasonal Indian cuisine" fill sizes="(max-width: 800px) 90vw, 48vw" />
            <div className="visit-card__stamp">A TABLE<br />FOR EVERY<br /><em>occasion</em></div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-shell site-footer__inner">
          <div><Link href="/" className="site-footer__brand">LUMIÈRE<span>✳</span></Link><p>Come hungry. Leave happy.</p></div>
          <div className="site-footer__links"><Link href="/menu">Menu</Link><Link href="/reservation">Reservations</Link><Link href="/track-order">Track an order</Link></div>
          <span className="site-footer__copyright">© {new Date().getFullYear()} Lumière Kitchen</span>
        </div>
      </footer>
    </main>
  );
}
