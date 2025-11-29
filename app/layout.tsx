import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Noto_Naskh_Arabic } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { cookies } from "next/headers"
import { Analytics } from "@vercel/analytics/next"
import { LocaleProvider } from "@/components/locale-provider"
import { type Locale, defaultLocale, localeDirection } from "@/i18n/config"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })
const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-naskh-arabic",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "SorooshX - Crypto Futures Trading",
  description: "Professional cryptocurrency futures trading platform",
  generator: "amir-mostafa-haji-sadeghian",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale
  const dir = localeDirection[locale]
  const messages = await getMessages()
  const isRtl = dir === "rtl"

  return (
    <html lang={locale} dir={dir} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoNaskhArabic.variable} ${isRtl ? "font-arabic" : "font-sans"} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
