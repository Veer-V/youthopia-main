
import React from 'react';
import { MapPin } from 'lucide-react';

const Map: React.FC = () => {
   return (
      <div className="h-full flex flex-col">
         <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Campus Map</h2>
            <p className="text-slate-500 mt-1">Navigate your way through the festival venue.</p>
         </div>

         <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex items-center justify-center p-4">
            <div className="w-full h-full flex items-center justify-center">
               <img
                  src="/campus-map.jpg"
                  alt="Youthopia Festival Campus Map"
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-lg"
                  onError={(e) => {
                     // Fallback if image doesn't load
                     e.currentTarget.style.display = 'none';
                     const parent = e.currentTarget.parentElement;
                     if (parent) {
                        parent.innerHTML = `
                  <div class="flex flex-col items-center justify-center gap-4 text-slate-400">
                    <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    <p class="text-lg font-medium">Campus map image not found</p>
                  </div>
                `;
                     }
                  }}
               />
            </div>
         </div>

         <div className="mt-4 bg-gradient-to-r from-brand-purple/10 to-brand-pink/10 rounded-2xl p-4 border border-brand-purple/20">
            <div className="flex items-start gap-3">
               <MapPin className="text-brand-purple mt-0.5 flex-shrink-0" size={20} />
               <div>
                  <h3 className="font-bold text-slate-900 text-sm">Key Locations</h3>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                     Find all major venues including the Main Building, IT Building, Concert Ground, GymKhana,
                     Box Office, Library, and Student Parking areas marked on the map above.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Map;
