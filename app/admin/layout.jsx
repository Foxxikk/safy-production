export const metadata = {
  title: "Administrace — ŠAFY BX",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-[#f6f6f4] text-ink">{children}</div>;
}
