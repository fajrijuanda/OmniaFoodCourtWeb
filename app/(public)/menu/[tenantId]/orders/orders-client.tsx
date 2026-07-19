"use client";

import { useEffect, useState } from "react";
import { Receipt, Clock, CheckCircle, ChevronRight, CookingPot } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

export default function OrdersClient({ tenantId }: { tenantId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const savedOrdersStr = localStorage.getItem(`omnia_orders_${tenantId}`);
        if (!savedOrdersStr) {
          setLoading(false);
          return;
        }
        const ids = JSON.parse(savedOrdersStr) as string[];
        if (ids.length === 0) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/fnb/public/orders/${tenantId}/history?ids=${ids.join(',')}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tenantId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Memuat riwayat pesanan...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-slate-100 text-slate-300">
          <Receipt className="h-8 w-8" />
        </div>
        <p className="font-bold text-slate-500">Belum ada riwayat pesanan di perangkat ini.</p>
        <Link href={`/menu/${tenantId}`} className="mt-4 inline-block rounded-full bg-orange-100 px-6 py-2 text-sm font-bold text-orange-600">
          Mulai Pesan
        </Link>
      </div>
    );
  }

  const getStatusIcon = (kitchenStatus: string) => {
    switch (kitchenStatus) {
      case 'PENDING': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'PREPARING':
      case 'COOKING': return <CookingPot className="w-5 h-5 text-orange-500 animate-pulse" />;
      case 'READY': 
      case 'DELIVERED': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusText = (kitchenStatus: string) => {
    switch (kitchenStatus) {
      case 'PENDING': return 'Menunggu Konfirmasi';
      case 'PREPARING':
      case 'COOKING': return 'Sedang Dimasak';
      case 'READY': return 'Siap Disajikan';
      case 'DELIVERED': return 'Selesai';
      default: return kitchenStatus;
    }
  };

  return (
    <div className="px-4 py-6 grid gap-4">
      {orders.map((order) => (
        <Link key={order.id} href={`/menu/${tenantId}/orders/${order.id}`} className="block">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 transition-shadow active:shadow-md">
            <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-4">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                <h3 className="font-black text-slate-800">{order.invoiceNumber}</h3>
              </div>
              <div className="bg-slate-50 p-2 rounded-full text-slate-400">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-4 bg-slate-50 p-3 rounded-xl">
              {getStatusIcon(order.kitchenStatus)}
              <span className="font-bold text-sm text-slate-700">{getStatusText(order.kitchenStatus)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">{order.items.length} Item</span>
              <span className="font-black text-slate-900">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
