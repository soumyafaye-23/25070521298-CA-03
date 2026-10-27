'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
// Floor plan configuration
const initialTables = [
    { id: 'T1', seats: 2, position: { x: 10, y: 10 } },
    { id: 'T2', seats: 2, position: { x: 40, y: 10 } },
    { id: 'T3', seats: 4, position: { x: 70, y: 10 } },
    { id: 'T4', seats: 4, position: { x: 10, y: 40 } },
    { id: 'T5', seats: 6, position: { x: 40, y: 40 } },
    { id: 'T6', seats: 4, position: { x: 80, y: 40 } },
    { id: 'T7', seats: 2, position: { x: 10, y: 70 } },
    { id: 'T8', seats: 2, position: { x: 40, y: 70 } },
    { id: 'T9', seats: 8, position: { x: 75, y: 70 } },
];
export function SeatMap({ onTableSelect, selectedTable, reservedTables = ['T2', 'T6'] }) {
    const tables = initialTables.map((t) => {
        const isReserved = reservedTables.includes(t.id);
        const isSelected = selectedTable === t.id;
        const status = isReserved ? 'reserved' : isSelected ? 'selected' : 'available';
        return {
            ...t,
            status,
        };
    });
    return (<div className="w-full bg-zinc-900/50 rounded-xl border border-white/10 relative p-8 overflow-hidden shadow-inner min-h-[500px]">
            <div className="absolute top-4 right-4 flex flex-col gap-3 text-sm text-gray-400 bg-black/40 p-3 rounded-lg backdrop-blur-sm z-10 border border-white/5">
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"/> Available</div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-red-500/20 border border-red-500 opacity-50"/> Reserved</div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-gold border border-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"/> Selected</div>
            </div>

            <div className="absolute top-4 left-4 text-xs font-mono text-gray-500 tracking-widest">
                RESTAURANT FLOOR PLAN
            </div>

            {/* Decorative entrance */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-600 tracking-widest">ENTRANCE</div>
            </div>

            <div className="relative w-full h-full min-h-[400px]">
                {tables.map((table) => {
            const isReserved = table.status === 'reserved';
            const isSelected = selectedTable === table.id;
            return (<motion.div key={table.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute flex items-center justify-center" style={{
                    left: `${table.position.x}%`,
                    top: `${table.position.y}%`,
                    width: table.seats <= 4 ? '100px' : '160px',
                    height: '100px',
                    transform: 'translate(-50%, -50%)' // Center based on position
                }}>
                            {/* Table Surface */}
                            <motion.button type="button" whileHover={!isReserved ? { scale: 1.05 } : {}} whileTap={!isReserved ? { scale: 0.95 } : {}} onClick={() => !isReserved && onTableSelect(table.id)} disabled={isReserved} className={cn('relative z-10 w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-xl border-2', isReserved
                    ? 'bg-zinc-800 border-zinc-700 cursor-not-allowed opacity-60 grayscale'
                    : isSelected
                        ? 'bg-gold border-gold text-black shadow-gold/20'
                        : 'bg-zinc-800/80 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500 shadow-lg cursor-pointer')}>
                                <div className={cn("font-bold text-lg font-serif", isReserved ? 'text-zinc-500' : isSelected ? 'text-black' : 'text-emerald-400')}>
                                    {table.id}
                                </div>
                                <div className={cn("text-xs font-medium uppercase tracking-wider mt-1", isReserved ? 'text-zinc-600' : isSelected ? 'text-black/70' : 'text-zinc-400')}>
                                    {table.seats} Seats
                                </div>
                            </motion.button>

                            {/* Chairs Visualization */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Top Chair */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-zinc-700 rounded-t-full"/>
                                {/* Bottom Chair */}
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-zinc-700 rounded-b-full"/>
                                {/* Side Chairs for larger tables */}
                                {table.seats > 2 && (<>
                                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-3 h-12 bg-zinc-700 rounded-l-full"/>
                                        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-3 h-12 bg-zinc-700 rounded-r-full"/>
                                    </>)}
                            </div>
                        </motion.div>);
        })}
            </div>
        </div>);
}
