
import React, { useMemo } from 'react';
import { Booking } from '../types';
import { BARBERS, SERVICES } from '../constants';
import { Shield, DollarSign, Users, Calendar, Clock, Trash2, Search } from 'lucide-react';

interface AdminViewProps {
  bookings: Booking[];
  onDeleteBooking: (id: string) => void;
}

// Helper to clean time
const cleanTime = (time: string) => {
  if (!time) return '--:--';
  if (time.includes('T')) {
    const match = time.match(/T(\d{2}):(\d{2})/);
    if (match) return `${match[1]}:${match[2]}`;
  }
  if (time.includes(':')) return time.substring(0, 5);
  return time;
};

export const AdminView: React.FC<AdminViewProps> = ({ bookings, onDeleteBooking }) => {
  
  // Calculate stats
  const stats = useMemo(() => {
    const activeBookings = bookings.filter(b => b.status === 'confirmed');
    const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    
    // Filter for "Today" (rough check)
    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookings = activeBookings.filter(b => b.date.startsWith(todayStr));
    const todayRevenue = todayBookings.reduce((sum, b) => sum + (b.price || 0), 0);

    return {
      totalActive: activeBookings.length,
      totalRevenue,
      todayCount: todayBookings.length,
      todayRevenue
    };
  }, [bookings]);

  const sortedBookings = [...bookings]
    .filter(b => b.status === 'confirmed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getBarberName = (id: string) => BARBERS.find(b => b.id === id)?.name || id;
  const getServiceName = (id: string) => SERVICES.find(s => s.id === id)?.name || id;

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-amber-600 p-2 rounded-lg text-black">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase text-white leading-none">Админ Панель</h1>
          <p className="text-xs text-zinc-500 font-mono uppercase">Режим Бога</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1">
            <DollarSign size={12} /> Выручка (Всего)
          </div>
          <div className="text-2xl font-mono font-bold text-white">{stats.totalRevenue.toLocaleString()}₽</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1 flex items-center gap-1">
            <Users size={12} /> Записей (Всего)
          </div>
          <div className="text-2xl font-mono font-bold text-white">{stats.totalActive}</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 col-span-2 flex justify-between items-center bg-gradient-to-r from-zinc-900 to-zinc-800">
           <div>
              <div className="text-zinc-400 text-[10px] uppercase font-bold mb-1">Сегодня</div>
              <div className="text-xl font-mono font-bold text-amber-500">+{stats.todayRevenue.toLocaleString()}₽</div>
           </div>
           <div className="text-right">
              <div className="text-zinc-400 text-[10px] uppercase font-bold mb-1">Клиентов</div>
              <div className="text-xl font-mono font-bold text-white">{stats.todayCount}</div>
           </div>
        </div>
      </div>

      {/* All Bookings List */}
      <div>
        <h2 className="text-lg font-bold uppercase text-white mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-amber-600" /> Все записи
        </h2>
        
        <div className="space-y-3">
          {sortedBookings.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-4">Нет активных записей</p>
          ) : (
            sortedBookings.map(booking => (
              <div key={booking.id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 relative group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-white font-bold text-sm">{booking.clientName}</div>
                    <div className="text-zinc-500 text-xs">{booking.clientPhone || 'Без телефона'}</div>
                    {booking.tgUsername && <div className="text-blue-400 text-[10px]">@{booking.tgUsername}</div>}
                  </div>
                  <div className="text-right">
                    <div className="text-amber-600 font-mono font-bold">{booking.price}₽</div>
                    <div className="text-zinc-600 text-[10px] uppercase">{booking.status}</div>
                  </div>
                </div>
                
                <div className="bg-zinc-950 rounded-lg p-2 flex items-center justify-between text-xs text-zinc-400 mb-3">
                   <div className="flex items-center gap-1">
                     <Calendar size={12} /> {booking.date}
                   </div>
                   <div className="flex items-center gap-1">
                     <Clock size={12} /> {cleanTime(booking.timeSlot)}
                   </div>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-zinc-800 pt-2 mt-2">
                   <span className="text-zinc-500">{getBarberName(booking.barberId)}</span>
                   <span className="text-zinc-300 font-medium truncate max-w-[120px]">{getServiceName(booking.serviceId)}</span>
                </div>

                <button 
                  onClick={() => {
                    if(confirm('Админ удаление: Вы уверены?')) onDeleteBooking(booking.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-900/20 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
