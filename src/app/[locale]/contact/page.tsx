import { Icon } from "@/components/icons";
import { Breadcrumb, PageHead } from "@/components/primitives";
import ContactForm from "@/components/ContactForm";
import { CONTENT, IMAGES, type Locale } from "@/lib/content";
import { isSectionFrozen } from "@/lib/cms/freeze";
import UnderConstruction from "@/components/UnderConstruction";

export const revalidate = 60;

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  if (await isSectionFrozen("contact")) return <UnderConstruction locale={locale} />;
  const c = CONTENT.contact[locale];
  const nav = CONTENT.nav[locale];
  const en = locale === "en";

  return (
    <div className="page-enter">
      <PageHead
        eyebrow={c.eyebrow}
        title={c.title}
        sub={c.sub}
        bg={IMAGES.service.civil}
        breadcrumb={<Breadcrumb locale={locale} homeLabel={nav[0].label} current={nav[6].label} />}
      />

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Info */}
            <div className="contact-info">
              <div className="contact-info-item">
                <span className="ic"><Icon.pin width={18} height={18} /></span>
                <div>
                  <h4>{c.addressLabel}</h4>
                  <p>{c.address}</p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="ic"><Icon.phone width={18} height={18} /></span>
                <div>
                  <h4>{c.phoneLabel}</h4>
                  <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="ic"><Icon.mail width={18} height={18} /></span>
                <div>
                  <h4>{c.emailLabel}</h4>
                  <a href={`mailto:${c.email}`}>{c.email}</a>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="ic"><Icon.clock width={18} height={18} /></span>
                <div>
                  <h4>{c.hoursLabel}</h4>
                  <p>{c.hours}</p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="ic" style={{ background: "#dcf6e3", color: "#1a6b3f" }}><Icon.whatsapp width={20} height={20} /></span>
                <div>
                  <h4>WhatsApp</h4>
                  <a href="https://wa.me/966538134516" target="_blank" rel="noopener noreferrer">{c.phone}</a>
                </div>
              </div>
            </div>

            {/* Form */}
            <ContactForm locale={locale} />
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section style={{ background: "#1a3a2c", height: 400, position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(201,161,88,.15), transparent 60%), repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 1px, transparent 1px 60px), repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0 1px, transparent 1px 60px)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#fff", textAlign: "center" }}>
          <Icon.pin width={48} height={48} style={{ color: "var(--gold-500)" }} />
          <div className="display" style={{ fontSize: 28, color: "#fff" }}>{c.address}</div>
          <a className="btn btn-gold" href="https://www.google.com/maps/place/Al+Olaya,+Riyadh" target="_blank" rel="noopener noreferrer">
            {en ? "Open in Google Maps" : "افتح في خرائط جوجل"} <Icon.arrowUpRight width={16} height={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
