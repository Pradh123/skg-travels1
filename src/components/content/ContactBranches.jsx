"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const branches = [
  { city: "Mumbai", title: "Head Office, Mumbai", address: "Office No. 170, 1st Floor, Evershine Mall, Link Road, Chincholi Bunder, Malad (W), Mumbai 400 064." },
  { city: "Pune", title: "Pune Branch", address: "Coming Soon" },
  { city: "Gujarat", title: "Gujarat Branch", address: "Coming Soon" },
  { city: "Nashik", title: "Nashik Branch", address: "Makhamalabab Road, Hanuman Wadi Patil Chal, Nashik, Panchvati (Maharashtra) - 422003, India." },
];

export default function ContactBranches() {
  const [selected, setSelected] = useState(0);
  const branch = branches[selected];

  return (
    <section className="mt-8" aria-label="Branch locations">
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-5">
        {branches.map(({ city }, index) => (
          <button
            key={city}
            type="button"
            role="tab"
            aria-selected={selected === index}
            className={`flex min-w-[76px] flex-col items-center gap-1 rounded-xl px-4 py-2 text-base font-semibold transition-colors ${selected === index ? "bg-lime-50 text-teal-950" : "text-slate-700 hover:bg-slate-50"}`}
            onClick={() => setSelected(index)}
          >
            <MapPin size={22} className="text-lime-600" aria-hidden="true" />
            {city}
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-xl border-2 border-lime-600/40 bg-lime-100/70 p-5 sm:p-6" role="tabpanel">
        <h2 className="text-lg font-semibold text-slate-950">{branch.title}</h2>
        <div className="my-4 border-t border-lime-900/15" />
        <p className="max-w-3xl text-base leading-7 text-slate-900">{branch.address}</p>
      </div>
    </section>
  );
}
