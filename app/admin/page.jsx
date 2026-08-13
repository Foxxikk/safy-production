import { isAuthed, isConfigured } from "@/lib/adminAuth";
import { getSiteData } from "@/lib/bxStore";
import LoginForm from "@/components/admin/LoginForm";
import AdminApp from "@/components/admin/AdminApp";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isConfigured()) {
    return (
      <div className="mx-auto max-w-md px-6 py-24">
        <h1 className="text-2xl font-medium">Administrace není nastavená</h1>
        <p className="mt-3 text-ink/60 leading-relaxed">
          Ve Vercelu chybí proměnná <code className="bg-ink/10 px-1.5 py-0.5">ADMIN_PASSWORD</code>.
          Nastavte ji v Project Settings → Environment Variables a nasazení znovu spusťte.
        </p>
      </div>
    );
  }

  if (!(await isAuthed())) return <LoginForm />;

  const data = await getSiteData({ fresh: true });
  return <AdminApp initialData={data} />;
}
