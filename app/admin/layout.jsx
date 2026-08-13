export const metadata = {
  title: "Administrace — ŠAFY BX",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen text-ink">{children}</div>;
}
