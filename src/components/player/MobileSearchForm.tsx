import { Phone } from "lucide-react";
import React from "react";

const MobileSearchForm = ({
  mobile,
  setMobile,
}: {
  mobile: string;
  setMobile: (mobile: string) => void;
}) => {
  return (
    <div className="relative rounded-xl border border-(--color-bg-border) bg-(--color-bg-card) p-4 shadow-(--shadow-card)">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
        Enter a valid Mobile Number
      </label>
      <div className="flex items-center gap-3">
        <Phone size={16} className="text-(--color-brand)" />
        <input
          type="tel"
          // placeholder="+91 9999999999"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="flex-1 outline-none text-base text-slate-800 font-medium"
        />
      </div>
    </div>
  );
};

export default MobileSearchForm;
