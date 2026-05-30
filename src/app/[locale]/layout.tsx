import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Archivo, Manrope, Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import UnderConstruction from "@/components/UnderConstruction";
import { LOCALES, type Locale } from "@/lib/content";
import { isArabicEnabled } from "@/lib/cms/locale-settings";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});
const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
  display: "swap",
});

const fontVars = `${archivo.variable} ${manrope.variable} ${cairo.variable} ${ibmArabic.variable}`;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: {
      default: isAr
        ? "مسار إعمار للمقاولات — الرياض، المملكة العربية السعودية"
        : "Masar Emaar Contracting Co. — Riyadh, Saudi Arabia",
      template: isAr ? "%s · مسار إعمار" : "%s · Masar Emaar",
    },
    description: isAr
      ? "شركة سعودية موثوقة في المقاولات والهندسة المدنية — نبني البنية التحتية والمنشآت الصناعية والتطويرات الكبرى منذ 2017."
      : "A trusted Saudi contracting and civil engineering firm — building infrastructure, industrial facilities, and landmark developments since 2017.",
    metadataBase: new URL("https://masaremaar.com"),
    alternates: {
      languages: { en: "/en", ar: "/ar" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const typedLocale = locale as Locale;
  const dir = typedLocale === "ar" ? "rtl" : "ltr";

  const arabicEnabled = await isArabicEnabled();

  // Arabic site switched off → show Under Construction for all /ar pages,
  // with links pointing to the English site (no header/footer to avoid
  // navigating deeper into the disabled locale).
  if (typedLocale === "ar" && !arabicEnabled) {
    return (
      <html lang="ar" dir="rtl" className={fontVars}>
        <body>
          <UnderConstruction locale="ar" homeHref="/en" contactHref="/en/contact" />
        </body>
      </html>
    );
  }

  // Hide the language button when it would point to a disabled locale.
  const showLangSwitch = typedLocale === "ar" ? true : arabicEnabled;

  return (
    <html lang={typedLocale} dir={dir} className={fontVars}>
      <body>
        <Header locale={typedLocale} showLangSwitch={showLangSwitch} />
        {children}
        <Footer locale={typedLocale} />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
