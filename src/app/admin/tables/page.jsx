"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Download, Printer, Plus, Trash2, Lock, User, LogOut, ShieldCheck, Mail, Key } from "lucide-react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function TableManager() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Table states
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [tablesLoading, setTablesLoading] = useState(true);
  
  // Bulk states
  const [bulkStart, setBulkStart] = useState("1");
  const [bulkEnd, setBulkEnd] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch role from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role); // 'owner' or 'kasir'
          } else {
            // Default to kasir if no role found
            setUserRole("kasir");
          }
        } catch (error) {
          console.error("Error fetching role:", error);
          setUserRole("kasir");
        }
        
        // Fetch tables from Firestore (Scoped to the current logged-in user)
        try {
          const tablesDoc = await getDoc(doc(db, "users", currentUser.uid, "settings", "tables"));
          if (tablesDoc.exists()) {
            setTables(tablesDoc.data().list || []);
          } else {
            // New system for this user, create initial tables
            const defaultTables = ["1", "2", "3", "4", "5"];
            await setDoc(doc(db, "users", currentUser.uid, "settings", "tables"), { 
              list: defaultTables,
              updatedAt: new Date().toISOString() 
            });
            setTables(defaultTables);
          }
        } catch (error) {
          console.error("Error fetching tables:", error);
        } finally {
          setTablesLoading(false);
        }
      } else {
        setUser(null);
        setUserRole(null);
        setTablesLoading(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setBaseUrl(window.location.origin);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoginError("Email atau password salah.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const addTable = async () => {
    console.log("Adding table:", newTable, "Current role:", userRole);
    
    if (userRole !== "owner") {
      alert("Hanya Owner yang boleh menambah meja! Periksa akun Anda.");
      return;
    }

    if (!newTable) {
      alert("Masukkan nomor meja terlebih dahulu!");
      return;
    }

    if (parseInt(newTable) <= 0) {
      alert("Nomor meja harus lebih besar dari 0!");
      return;
    }

    const tableStr = newTable.toString();
    if (tables.includes(tableStr)) {
      alert("Meja ini sudah ada!");
      return;
    }

    const updatedTables = [...tables, tableStr].sort((a,b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (isNaN(numA) || isNaN(numB)) return a.localeCompare(b);
      return numA - numB;
    });

    try {
      await setDoc(
        doc(db, "users", user.uid, "settings", "tables"), 
        { 
          list: updatedTables,
          updatedAt: new Date().toISOString()
        }, 
        { merge: true }
      );
      setTables(updatedTables);
      setNewTable("");
      alert("Meja #" + tableStr + " berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding table:", error);
      alert("Gagal menambahkan meja: " + error.message);
    }
  };

  const generateBulk = async () => {
    if (userRole !== "owner") {
      alert("Hanya Owner yang boleh membuat meja massal!");
      return;
    }

    const start = parseInt(bulkStart);
    const end = parseInt(bulkEnd);

    if (isNaN(start) || isNaN(end) || start <= 0 || end <= 0 || end < start) {
      alert("Masukkan range meja yang valid! (Contoh: 1 sampai 10)");
      return;
    }

    if (end - start > 50) {
      alert("Maksimal generate 50 meja sekaligus untuk menjaga performa.");
      return;
    }

    if (!confirm(`Generate meja dari #${start} sampai #${end}? Ini akan menggabungkan dengan meja yang sudah ada.`)) return;

    const newRange = Array.from({ length: end - start + 1 }, (_, i) => String(start + i));
    const updatedTables = Array.from(new Set([...tables, ...newRange])).sort((a,b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (isNaN(numA) || isNaN(numB)) return a.localeCompare(b);
      return numA - numB;
    });

    try {
      await setDoc(
        doc(db, "users", user.uid, "settings", "tables"), 
        { 
          list: updatedTables,
          updatedAt: new Date().toISOString()
        }, 
        { merge: true }
      );
      setTables(updatedTables);
      setBulkEnd("");
      alert("Berhasil membuat " + (end - start + 1) + " meja baru!");
    } catch (error) {
      console.error("Error bulk generating:", error);
      alert("Gagal generate: " + error.message);
    }
  };

  const removeTable = async (table) => {
    if (userRole !== "owner") {
      alert("Hanya Owner yang boleh menghapus meja!");
      return;
    }
    if (!confirm("Hapus meja #" + table + "?")) return;

    const updatedTables = tables.filter((t) => t !== table);
    try {
      await setDoc(
        doc(db, "users", user.uid, "settings", "tables"), 
        { 
          list: updatedTables,
          updatedAt: new Date().toISOString()
        }, 
        { merge: true }
      );
      setTables(updatedTables);
      alert("Meja #" + table + " berhasil dihapus.");
    } catch (error) {
      console.error("Error removing table:", error);
      alert("Gagal menghapus meja: " + error.message);
    }
  };

  const downloadQR = (tableId) => {
    const svg = document.getElementById(`qr-${tableId}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-Meja-${tableId}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // LOGIN VIEW
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100 animate-in zoom-in duration-500">
          <div className="flex flex-col items-center mb-10">
             <div className="bg-orange-600 p-4 rounded-3xl text-white shadow-xl shadow-orange-200 mb-6">
                <Lock size={32} strokeWidth={2.5} />
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Admin Login</h2>
             <p className="text-slate-400 font-bold text-sm tracking-widest uppercase mt-2">Warteg Digital Setup</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
               <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-600 transition-colors" size={20} />
               <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-3 border-transparent focus:border-orange-500/10 p-5 pl-16 rounded-2xl outline-none transition-all font-bold text-slate-900"
                required
               />
            </div>

            <div className="relative group">
               <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-600 transition-colors" size={20} />
               <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-3 border-transparent focus:border-orange-500/10 p-5 pl-16 rounded-2xl outline-none transition-all font-bold text-slate-900"
                required
               />
            </div>

            {loginError && <p className="text-red-500 text-sm font-bold text-center">{loginError}</p>}

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-orange-600 hover:-translate-y-1 transition-all active:scale-95"
            >
              Login Sekarang
            </button>
          </form>

          {/* Setup Helper (Demo Data) */}
          <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-3">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Setup Meja Baru? (Demo Data)</p>
             <button 
               onClick={async () => {
                 try {
                   // Create Owner
                   const owner = await createUserWithEmailAndPassword(auth, "owner@warteg.id", "password123");
                   await setDoc(doc(db, "users", owner.user.uid), { role: "owner", email: "owner@warteg.id" });
                   
                   // Create Kasir
                   const kasir = await createUserWithEmailAndPassword(auth, "kasir@warteg.id", "password123");
                   await setDoc(doc(db, "users", kasir.user.uid), { role: "kasir", email: "kasir@warteg.id" });
                   
                   alert("Demo Users Berhasil Dibuat!\nOwner: owner@warteg.id\nKasir: kasir@warteg.id\nPassword: password123");
                 } catch (e) {
                   alert("Users mungkin sudah terdaftar atau terjadi error: " + e.message);
                 }
               }}
               className="text-xs font-black text-orange-600 bg-white border border-orange-100 p-3 rounded-xl hover:bg-orange-600 hover:text-white transition-all"
             >
                Buat Akun Demo (Owner & Kasir)
             </button>
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-50 text-center">
             <Link href="/" className="text-slate-400 hover:text-orange-600 font-bold text-sm transition-colors flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Kembali ke Menu Utama
             </Link>
          </div>
        </div>
      </div>
    );
  }

  // UNAUTHORIZED ROLE VIEW
  if (userRole === "kasir") {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
             <div className="max-w-md">
                 <div className="bg-red-50 text-red-500 p-6 rounded-[3rem] border border-red-100 shadow-xl mb-8">
                    <User size={64} className="mx-auto mb-4 opacity-50" />
                    <h2 className="text-2xl font-black">Akses Terbatas</h2>
                    <p className="mt-2 font-bold opacity-70">Akun Anda adalah Kasir. Fitur Generate Meja hanya untuk Owner.</p>
                 </div>
                 <div className="flex gap-4">
                    <Link href="/" className="flex-1 bg-white border-2 border-slate-100 p-5 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all">Back Home</Link>
                    <button onClick={handleLogout} className="flex-1 bg-slate-900 text-white p-5 rounded-2xl font-black">Logout</button>
                 </div>
             </div>
        </div>
    );
  }

  // AUTHORIZED OWNER VIEW
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 mb-20 selection:bg-orange-100">
      <style jsx global>{`
        @media print {
            body * {
                visibility: hidden;
            }
            .print-section, .print-section * {
                visibility: visible;
            }
            .print-section {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 20px !important;
                padding: 20px !important;
                background: white !important;
            }
            .no-print {
                display: none !important;
            }
            .qr-card-print {
                border: 1px solid #eee !important;
                padding: 15px !important;
                page-break-inside: avoid;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
        }
      `}</style>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-colors font-bold text-sm">
            <ArrowLeft size={18} /> BACK HOME
            </Link>

            <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="bg-green-50 text-green-600 p-2 rounded-xl">
                   <ShieldCheck size={20} />
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Owner Access</p>
                    <p className="text-sm font-black text-slate-900 leading-none">{user.email}</p>
                </div>
                <button onClick={handleLogout} className="ml-4 p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                </button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 no-print">
            {/* Manual Add Card */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Manual Add</h2>
                    <p className="text-slate-400 font-bold text-sm mb-6">Tambah satu meja spesifik.</p>
                    <div className="flex gap-4">
                        <input 
                            type="number" 
                            placeholder="No. Meja"
                            value={newTable}
                            onChange={(e) => setNewTable(e.target.value)}
                            className="bg-slate-50 border-3 border-transparent focus:border-orange-500/10 rounded-2xl px-6 py-4 w-full focus:bg-white outline-none transition-all font-black text-slate-900"
                        />
                        <button 
                            onClick={addTable}
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-orange-600 transition-all flex items-center gap-3 shrink-0"
                        >
                            <Plus size={20} strokeWidth={3} /> ADD
                        </button>
                    </div>
                </div>
            </div>

            {/* Bulk Generate Card */}
            <div className="bg-orange-600 p-10 rounded-[3rem] shadow-xl shadow-orange-100 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-black text-white mb-2">Mass Generate</h2>
                    <p className="text-orange-100 font-bold text-sm mb-6">Buat banyak meja sekaligus (Range).</p>
                    <div className="flex gap-4 items-center">
                        <input 
                            type="number" 
                            placeholder="DARI"
                            value={bulkStart}
                            onChange={(e) => setBulkStart(e.target.value)}
                            className="bg-white/10 border-3 border-transparent focus:border-white/20 rounded-2xl px-4 py-4 w-full focus:bg-white/20 outline-none transition-all font-black text-white placeholder:text-white/40"
                        />
                        <span className="text-white font-black">TO</span>
                        <input 
                            type="number" 
                            placeholder="SAMPAI"
                            value={bulkEnd}
                            onChange={(e) => setBulkEnd(e.target.value)}
                            className="bg-white/10 border-3 border-transparent focus:border-white/20 rounded-2xl px-4 py-4 w-full focus:bg-white/20 outline-none transition-all font-black text-white placeholder:text-white/40"
                        />
                        <button 
                            onClick={generateBulk}
                            className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all flex items-center gap-3 shrink-0"
                        >
                            GENERATE
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between mb-8 no-print">
            <div>
                <h2 className="text-2xl font-black text-slate-900">Total {tables.length} Meja</h2>
                <p className="text-slate-400 font-bold text-sm">Download atau Cetak barcode meja Anda.</p>
            </div>
            <button 
                onClick={() => window.print()}
                className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black hover:bg-emerald-600 transition-all flex items-center gap-3"
            >
                <Printer size={20} /> CETAK SEMUA MEJA
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 print-section">
          {tables.map((table) => {
            const qrUrl = `${baseUrl}/menu?table=${table}&ownerId=${user.uid}`;
            return (
              <div key={table} className="bg-white p-8 rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all group overflow-hidden relative qr-card-print">
                <div className="flex justify-between items-start mb-8 w-full no-print">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Meja #{table}</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Active QR CODE</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeTable(table)}
                    className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <Trash2 size={20} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Print Only Header */}
                <div className="hidden print:block mb-4">
                    <h3 className="text-2xl font-bold text-slate-900">MEJA {table}</h3>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2.5rem] flex items-center justify-center mb-8 border-2 border-dashed border-slate-100 group-hover:border-orange-500/20 group-hover:bg-white transition-all duration-500 relative w-full aspect-square">
                  <QRCodeSVG 
                    id={`qr-${table}`}
                    value={qrUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                    fgColor="#0f172a"
                  />
                </div>

                <div className="flex gap-3 w-full no-print">
                   <button 
                    onClick={() => downloadQR(table)}
                    className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-orange-600 hover:-translate-y-1 shadow-lg transition-all flex items-center justify-center gap-2"
                   >
                     <Download size={18} className="stroke-[2.5px]" /> PNG
                   </button>
                   <button 
                    onClick={() => window.print()}
                    className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"
                    title="Print QR"
                   >
                     <Printer size={18} />
                   </button>
                </div>
                
                {/* Print Footer */}
                <div className="hidden print:block mt-2">
                    <p className="text-[10px] text-slate-400">Scan untuk pesan menu</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 p-10 bg-orange-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-orange-200">
             <div className="text-center md:text-left">
                <h3 className="text-3xl font-black">Butuh Bantuan?</h3>
                <p className="font-bold opacity-80 max-w-sm mt-2">Hubungi Tim IT Warteg Digital jika Anda mengalami kendala pada sistem barcode.</p>
             </div>
             <button className="bg-white text-orange-600 px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform active:scale-95">Hubungi Support</button>
        </div>
      </div>
    </div>
  );
}
