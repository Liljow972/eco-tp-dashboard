import Sidebar from '@/components/shell/Sidebar'
import Header from '@/components/shell/Header'

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ecotp-beige">
      <Sidebar />
      <Header />
      <main className="ml-64 px-6 py-6">
        {children}
      </main>
    </div>
  )
}