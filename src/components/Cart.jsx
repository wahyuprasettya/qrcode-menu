"use client";

import React, { useState, useMemo } from "react";
import { formatRupiah } from "@/utils/formatRupiah";
import { X, Plus, Minus, Send, ShoppingBag, UtensilsCrossed, User, MessageSquare } from "lucide-react";

/**
 * Premium Cart with Name, Table, and Notes input.
 */
/**
 * Unified Cart Content component moved outside to prevent focus loss on re-render.
 */
const CartContent = ({ 
  showClose = true, 
  embedded = false, 
  cart, 
  onUpdateQty, 
  onRemove, 
  onCheckout, 
  tableNumber, 
  customerName, 
  setCustomerName, 
  notes, 
  setNotes, 
  setIsOpen 
}) => {
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  return (
    <div className={`flex flex-col ${embedded ? 'h-full' : 'bg-white p-8 pb-10 rounded-t-[4rem] shadow-[0_-20px_100px_rgba(0,0,0,0.3)] max-w-2xl mx-auto max-h-[92vh]'} overflow-y-auto no-scrollbar`}>
      {/* Modal Header */}
      <div className={`flex items-center justify-between mb-10 border-b border-slate-50 pb-6 sticky top-0 ${embedded ? 'bg-white/80' : 'bg-white/95'} backdrop-blur-md z-10 ${embedded ? '-mx-4 px-4' : '-mx-8 px-8'} pt-2`}>
         <div className="flex flex-col">
            <h2 className={`${embedded ? 'text-2xl' : 'text-3xl'} font-black text-slate-900 tracking-tighter`}>Ringkasan <span className="text-orange-600">Order</span></h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mt-1">Review your meal choices</p>
         </div>
        {showClose && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-4 hover:bg-slate-50 rounded-[1.5rem] text-slate-300 transition-all hover:text-red-500 hover:rotate-90"
          >
            <X size={28} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Combined Input Section */}
      <div className="space-y-4 mb-12">
         <div className={`grid grid-cols-1 ${embedded ? '' : 'md:grid-cols-2'} gap-4`}>
            <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] flex items-center gap-4 shadow-2xl">
               <div className="bg-white/10 p-3 rounded-2xl">
                  <UtensilsCrossed size={20} className="text-orange-500" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1 leading-none">Meja Anda</p>
                  <p className="font-black text-xl leading-none">#{tableNumber || "?"}</p>
               </div>
            </div>

            <div className="relative group">
               <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-600 transition-all" size={24} />
               <input
                 type="text"
                 required
                 value={customerName}
                 onChange={(e) => setCustomerName(e.target.value)}
                 placeholder="Nama Siapa?*"
                 className="w-full bg-slate-50 border-3 border-transparent focus:border-orange-500/10 focus:bg-white p-6 pl-16 rounded-[2.5rem] outline-none transition-all font-black text-lg text-slate-900 placeholder:text-slate-200"
               />
            </div>
         </div>

         {/* Notes Field */}
         <div className="relative group overflow-hidden bg-slate-50 rounded-[2.5rem] hover:bg-white transition-all border-3 border-transparent focus-within:border-orange-500/20 focus-within:bg-white">
            <div className="bg-white/50 p-4 px-6 flex items-center gap-3 border-b border-white">
               <MessageSquare size={18} className="text-orange-600 stroke-[3px]" />
               <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Catatan?</span>
            </div>
            <textarea
              rows="1"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gak pedas ya..."
              className="w-full p-6 pt-4 bg-transparent outline-none font-bold text-slate-700 placeholder:text-slate-200 placeholder:italic resize-none"
            />
         </div>
      </div>

      {/* Item List */}
      <div className="space-y-8 mb-16 flex-1">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center group px-2 animate-in fade-in transition-all">
            <div className="flex-1 pr-4">
              <h4 className="font-black text-slate-900 text-lg leading-tight mb-1 group-hover:text-orange-600 transition-colors">
                {item.name}
              </h4>
              <p className="text-slate-400 text-xs font-black opacity-30">
                {formatRupiah(item.price)}
              </p>
            </div>
            <div className="flex bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100 items-center gap-4">
              <button
                onClick={() => item.qty > 1 ? onUpdateQty(item.id, -1) : onRemove(item.id)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-sm"
              >
                <Minus size={18} strokeWidth={3} />
              </button>
              <span className="font-black text-slate-900 text-lg w-5 text-center">
                {item.qty}
              </span>
              <button
                onClick={() => onUpdateQty(item.id, 1)}
                className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white hover:bg-orange-600 transition-all shadow-lg"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Final Summary */}
      <div className={`border-t-3 border-dashed border-slate-50 pt-8 mt-auto sticky bottom-0 bg-white ${embedded ? '-mx-4 px-4' : '-mx-8 px-12'} pb-4 flex flex-col gap-6`}>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
             <span className="text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Total</span>
             <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
              {formatRupiah(total)}
            </span>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-xl">
             <span className="text-sm font-black text-slate-900">{cart.reduce((s, i) => s + i.qty, 0)} Porsi</span>
          </div>
        </div>
        
        <button
          onClick={onCheckout}
          disabled={!customerName.trim()}
          className={`w-full font-black h-20 rounded-[2rem] shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95 text-lg ${
            !customerName.trim() 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
              : "bg-orange-600 text-white shadow-orange-100 hover:bg-orange-700"
          }`}
        >
          {!customerName.trim() ? (
             <div className="flex flex-col items-center">
                <span className="uppercase tracking-widest text-[10px] opacity-70">Lengkapi Data</span>
                <span className="text-sm">Isi Nama Pemesan</span>
             </div>
          ) : (
            <>
              <Send size={20} className="stroke-[3px]" />
              Kirim Order Sekarang
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const Cart = ({ 
  cart, 
  onUpdateQty, 
  onRemove, 
  onCheckout, 
  tableNumber, 
  customerName, 
  setCustomerName,
  notes,
  setNotes,
  isSidebar = false // New prop
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);


  if (cart.length === 0 && !isSidebar) return null;
  
  if (isSidebar) {
    return (
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl h-full p-6 flex flex-col">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 p-10">
            <ShoppingBag size={64} className="mb-4" />
            <p className="font-black uppercase tracking-widest text-xs">Keranjang Kosong</p>
          </div>
        ) : (
          <CartContent 
            showClose={false} 
            embedded={true} 
            cart={cart}
            onUpdateQty={onUpdateQty}
            onRemove={onRemove}
            onCheckout={onCheckout}
            tableNumber={tableNumber}
            customerName={customerName}
            setCustomerName={setCustomerName}
            notes={notes}
            setNotes={setNotes}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-slate-900 text-white p-5 rounded-[2.5rem] shadow-[0_20px_60px_rgba(15,23,42,0.4)] flex items-center justify-between hover:scale-[1.03] transition-all active:scale-95 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-600 p-3 rounded-2xl relative">
                <ShoppingBag size={24} className="stroke-[2.5px]" />
                <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                  {cart.length}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1.5">
                  Total Bayar
                </p>
                <p className="text-xl font-black leading-none tracking-tight">{formatRupiah(total)}</p>
              </div>
            </div>
            <div className="bg-white/10 px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 group-hover:bg-white/20 transition-all uppercase tracking-widest">
               <span>Konfirmasi Pesanan</span>
               <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-50 animate-in fade-in duration-500"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white z-[60] animate-in slide-in-from-bottom duration-700">
             <CartContent 
               showClose={true} 
               embedded={false} 
               cart={cart}
               onUpdateQty={onUpdateQty}
               onRemove={onRemove}
               onCheckout={onCheckout}
               tableNumber={tableNumber}
               customerName={customerName}
               setCustomerName={setCustomerName}
               notes={notes}
               setNotes={setNotes}
               setIsOpen={setIsOpen}
             />
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
