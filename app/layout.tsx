import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { cookies } from "next/headers"
import { Analytics } from "@vercel/analytics/next"
import { LocaleProvider } from "@/components/locale-provider"
import { type Locale, defaultLocale, localeDirection } from "@/i18n/config"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

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

  return (
    <html lang={locale} dir={dir} className="dark">
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
