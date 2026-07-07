import { Phone } from "lucide-react";
import React from "react";

const CreatePlayerForm = ({
  mobile,
  fullName,
  setFullName,
}: {
  mobile: string;
  fullName: string;
  setFullName: (fullName: string) => void;
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border-l-2 border-red-500 relative">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
        Enter a valid Mobile Number
      </label>
      <div className="flex items-center gap-3">
        <Phone size={16} className="text-blue-600" />
        <p className="flex-1 outline-none text-base text-slate-800 font-medium">
          {mobile}
        </p>
      </div>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
        Full Name
      </label>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="e.g. Virat Kohli"
        className="w-full outline-none text-base text-slate-800 font-medium"
      />
    </div>
  );
};

export default CreatePlayerForm;
