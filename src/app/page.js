import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Settings, Sparkles, QrCode, UtensilsCrossed, ShoppingBag, Clock } from "lucide-react";

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

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-orange-200">Tata Cara Pemesanan:</h3>
            <div className="grid gap-4">
              {[
                {
                  icon: <QrCode className="text-orange-600" />,
                  title: "Pindai QR",
                  desc: "Scan QR di meja Anda menggunakan kamera HP"
                },
                {
                  icon: <UtensilsCrossed className="text-orange-600" />,
                  title: "Pilih Menu",
                  desc: "Pilih makanan & minuman favorit Anda"
                },
                {
                  icon: <ShoppingBag className="text-orange-600" />,
                  title: "Checkout",
                  desc: "Konfirmasi pesanan & masukkan nama Anda"
                },
                {
                  icon: <Clock className="text-orange-600" />,
                  title: "Sajikan",
                  desc: "Tunggu & pesanan akan diantar ke meja"
                }
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all group">
                  <div className="bg-white p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-lg leading-tight">{step.title}</h4>
                    <p className="text-xs opacity-70 font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>

          <div className="pt-4 lg:pt-0 opacity-40">
             <p className="text-[10px] lg:text-[11px] uppercase font-black tracking-[0.5em]">
               Kedai 123 Tengger &bull; Powered by <Link href="/admin/tables" className="hover:opacity-70 transition-opacity">Wahyu Tech Solution</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
