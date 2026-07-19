import { User } from "lucide-react";

export default async function ProfilePage() {
  return (
    <div>
      <header className="sticky top-0 z-40 bg-white/90 px-4 py-4 backdrop-blur-md shadow-sm">
        <h1 className="text-xl font-black text-slate-900">Profil</h1>
      </header>

      <div className="px-4 py-6">
        <div className="text-center py-20">
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-slate-100 text-slate-300">
            <User className="h-8 w-8" />
          </div>
          <p className="font-bold text-slate-500">Anda memesan sebagai tamu.</p>
        </div>
      </div>
    </div>
  );
}


export const dynamicParams = false;

export function generateStaticParams() { return [{ tenantId: "_mobile" }]; }
