import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Settings, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-orange-600 flex flex-col items-center justify-center p-6 text-white selection:bg-white selection:text-orange-600 overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500 rounded-full blur-[120px] opacity-50 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-400 rounded-full blur-[120px] opacity-30" />

      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 z-10">
        {/* QR Visual Card */}
        <div className="bg-white p-8 lg:p-12 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-in zoom-in duration-1000 relative group transition-all hover:scale-[1.02] hover:-rotate-2">
          <div className="p-8 lg:p-12 rounded-[36px] relative flex items-center justify-center">
             <div className="absolute -top-6 -right-6 bg-orange-600 text-white p-4 rounded-2xl shadow-xl ring-8 ring-white animate-bounce-slow">
               <Sparkles size={32} />
             </div>
            <Image
              src="/logo-kedai.png"
              alt="Kedai 123 Tengger"
              width={200}
              height={200}
              className="w-[160px] h-[160px] lg:w-[200px] lg:h-[200px] object-contain drop-shadow-lg"
              priority
            />
          </div>
          <div className="space-y-4 mt-8 text-center">
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Kedai <span className="text-orange-600">123</span>
              <br />
              <span className="text-orange-600">Tengger</span>
            </h1>
            <div className="flex items-center justify-center gap-2 bg-gray-50 py-2 px-5 rounded-full w-max mx-auto border border-gray-100">
               <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
               <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Dapur Aktif</p>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-md w-full text-center lg:text-left space-y-8 lg:space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black leading-[1.1]">Pesan Lebih <br className="hidden lg:block"/> <span className="text-orange-200 italic">Mudah</span></h2>
            <p className="opacity-80 text-base lg:text-lg leading-relaxed font-semibold">
              Revolusi cara pesan di Kedai 123 Tengger. Scan QR di meja, pilih menu favorit, dan nikmati tanpa antre.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <Link
              href="/menu?table=12"
              className="flex items-center justify-between bg-white text-orange-600 p-6 lg:p-8 rounded-[32px] font-black text-xl lg:text-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:bg-orange-50 active:scale-95 transition-all w-full group overflow-hidden relative"
            >
              <span className="z-10">Buka Menu (Meja 12)</span>
              <div className="bg-orange-600 text-white p-3 rounded-2xl group-hover:px-6 transition-all z-10">
                 <ArrowRight />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50/0 via-orange-50/50 to-orange-50/0 -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
            </Link>

            <Link
              href="/admin/tables"
              className="flex items-center justify-center lg:justify-start gap-4 text-white/70 p-4 rounded-2xl font-black text-sm lg:text-base hover:text-white hover:bg-white/10 transition-all w-full group"
            >
              <div className="bg-white/10 p-2 rounded-xl group-hover:rotate-180 transition-transform duration-500">
                <Settings size={20} />
              </div>
              <span>Setup Dashboard (Admin)</span>
            </Link>
          </div>

          <div className="pt-4 lg:pt-0 opacity-40">
             <p className="text-[10px] lg:text-[11px] uppercase font-black tracking-[0.5em]">Kedai 123 Tengger &bull; Powered by Wahyu Tech Solution</p>
          </div>
        </div>
      </div>
    </div>
  );
}
