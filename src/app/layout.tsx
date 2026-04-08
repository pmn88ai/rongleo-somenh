import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mệnh Lý — Hồ sơ số mệnh",
  description: "Phân tích Thần Số Học, Chiêm Tinh Đông Tây và Phong Thủy từ ngày sinh",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
