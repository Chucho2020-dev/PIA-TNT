import { GeistSans, GeistMono } from 'geist/font'
//import "./globals.css";
//En ocaciones el page.jsx agarra este layout en vez del que hice

const geistSans = GeistSans
const geistMono = GeistMono

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
