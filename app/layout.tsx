import { Inter } from 'next/font/google'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { Header } from './components/header'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Game Market',
  description: 'Buy and sell game items',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black min-h-screen`} suppressHydrationWarning>
        <Providers>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main className="pt-16">
                {children}
              </main>
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}

