"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3, MapPin, Navigation2, Plane } from "lucide-react";
import { citySuggestions } from "@/data/citySuggestions";

const inputClass =
  "mt-1.5 h-10 w-full min-w-0 rounded-lg border border-[#d6deda] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-brand";

const passengerOptions = [
  ...Array.from({ length: 6 }, (_, i) => ({ value: String(i + 1), label: `${i + 1} ${i === 0 ? "Passenger" : "Passengers"}` })),
  { value: "More than 7", label: "More than 7" },
];
const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthFormatter = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function localDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function panelPlacement(trigger, preferredHeight) {
  const bounds = trigger.getBoundingClientRect();
  const below = window.innerHeight - bounds.bottom - 12;
  const above = bounds.top - 12;
  const up = below < preferredHeight && above > below;
  return { up, maxHeight: Math.max(40, (up ? above : below) - 8) };
}

function CityAutocomplete({ label, name, placeholder }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [placement, setPlacement] = useState({ up: false, maxHeight: 240 });
  const [remote, setRemote] = useState({ query: "", places: [] });
  const inputRef = useRef(null);
  const selectedRef = useRef(null);
  const listId = useId();
  const FieldIcon = name === "from" ? MapPin : Navigation2;
  const query = value.trim().toLowerCase();
  const localMatches = query
    ? citySuggestions.filter((city) => city.toLowerCase().includes(query)).sort((a, b) =>
        Number(b.toLowerCase().startsWith(query)) - Number(a.toLowerCase().startsWith(query))
      )
    : [];
  const remoteMatches = remote.query === query ? remote.places : [];
  const matches = [...new Set([...remoteMatches, ...localMatches])].slice(0, 8);
  const safeActive = Math.min(active, matches.length - 1);
  const showList = open && matches.length > 0;

  useEffect(() => {
    if (query.length < 2 || selectedRef.current === value) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/places?q=${encodeURIComponent(value.trim())}`, { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        setRemote({ query, places: data.places || [] });
        setActive(0);
      } catch {
        // The local city list remains available if the place service is unreachable.
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, value]);

  function choose(city) {
    selectedRef.current = city;
    setValue(city);
    setOpen(false);
    setActive(0);
  }

  return (
    <div
      className={`booking-city${placement.up ? " is-up" : ""}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <span className="booking-city-icon" aria-hidden="true">
        <FieldIcon size={18} strokeWidth={2.2} />
      </span>
      <input
        ref={inputRef}
        className={inputClass}
        name={name}
        value={value}
        placeholder={placeholder}
        role="combobox"
        aria-label={label}
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList ? `${listId}-${safeActive}` : undefined}
        autoComplete="off"
        required
        onFocus={() => {
          setPlacement(panelPlacement(inputRef.current, 240));
          setOpen(true);
        }}
        onChange={(event) => {
          selectedRef.current = null;
          setValue(event.target.value);
          setActive(0);
          setPlacement(panelPlacement(inputRef.current, 240));
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (!showList) return;
          if (event.key === "ArrowDown") { event.preventDefault(); setActive((current) => (current + 1) % matches.length); }
          if (event.key === "ArrowUp") { event.preventDefault(); setActive((current) => (current - 1 + matches.length) % matches.length); }
          if (event.key === "Enter") { event.preventDefault(); choose(matches[safeActive]); }
        }}
      />
      {showList && (
        <div className="booking-city-list" style={{ "--booking-panel-space": `${placement.maxHeight}px` }}>
          <div id={listId} role="listbox" aria-label={`${label} suggestions`}>
            {matches.map((city, index) => (
              <button
                id={`${listId}-${index}`}
                key={city}
                type="button"
                role="option"
                aria-selected={index === safeActive}
                className="booking-city-option"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(city)}
              >
                <MapPin size={15} aria-hidden="true" /> {city}
              </button>
            ))}
          </div>
          {remoteMatches.length > 0 && (
            <a className="booking-city-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
              © OpenStreetMap contributors
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function BookingCalendar({ label, value, onChange, placeholder, minDate, alignEnd = false }) {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(null);
  const [placement, setPlacement] = useState({ up: false, maxHeight: 300 });
  const triggerRef = useRef(null);
  const today = localDateString(new Date());
  const earliestDate = minDate && minDate > today ? minDate : today;
  const month = visibleMonth ? new Date(`${visibleMonth}-01T00:00:00Z`) : null;
  const year = month?.getUTCFullYear();
  const monthIndex = month?.getUTCMonth();
  const leadingDays = month ? month.getUTCDay() : 0;
  const daysInMonth = month ? new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate() : 0;

  function changeMonth(offset) {
    const next = new Date(Date.UTC(year, monthIndex + offset, 1));
    setVisibleMonth(next.toISOString().slice(0, 7));
  }

  return (
    <div
      className={`booking-calendar${alignEnd ? " is-end" : ""}${placement.up ? " is-up" : ""}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="booking-dropdown-trigger"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          if (!open) {
            setVisibleMonth(value && value >= today ? value.slice(0, 7) : earliestDate.slice(0, 7));
            setPlacement(panelPlacement(triggerRef.current, 300));
          }
          setOpen(!open);
        }}
      >
        <span className={value ? "" : "booking-dropdown-placeholder"}>
          {value ? dateFormatter.format(new Date(`${value}T00:00:00Z`)) : placeholder}
        </span>
        <CalendarDays size={17} aria-hidden="true" />
      </button>
      {open && month && (
        <div className="booking-calendar-popover" role="dialog" aria-label={label} style={{ "--booking-panel-space": `${placement.maxHeight}px` }}>
          <div className="booking-calendar-header">
            <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}><ChevronLeft size={18} /></button>
            <strong>{monthFormatter.format(month)}</strong>
            <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}><ChevronRight size={18} /></button>
          </div>
          <div className="booking-calendar-grid">
            {weekdays.map((day) => <span key={day} className="booking-calendar-weekday">{day}</span>)}
            {Array.from({ length: leadingDays }, (_, i) => <span key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const date = new Date(Date.UTC(year, monthIndex, i + 1)).toISOString().slice(0, 10);
              return (
                <button
                  key={date}
                  type="button"
                  disabled={date < earliestDate}
                  aria-label={dateFormatter.format(new Date(`${date}T00:00:00Z`))}
                  aria-pressed={value === date}
                  onClick={() => { onChange(date); setOpen(false); }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingDropdown({ options, value, onChange, placeholder, Icon, label }) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState({ up: false, maxHeight: 205 });
  const triggerRef = useRef(null);
  const selected = options.find((option) => option.value === value);
  return (
    <div
      className={`booking-dropdown${placement.up ? " is-up" : ""}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="booking-dropdown-trigger"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          if (!open) setPlacement(panelPlacement(triggerRef.current, Math.min(205, options.length * 37 + 2)));
          setOpen(!open);
        }}
      >
        <span className={selected ? "" : "booking-dropdown-placeholder"}>{selected?.label || placeholder}</span>
        <Icon size={17} aria-hidden="true" />
      </button>
      {open && (
        <div className="booking-dropdown-list" role="listbox" aria-label={label} style={{ "--booking-panel-space": `${placement.maxHeight}px` }}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              className="booking-dropdown-option"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookingForm({ compact = false, hero = false }) {
  const [error, setError] = useState("");
  const [tripType, setTripType] = useState("outstation");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("");
  const tripTypes = [
    { id: "outstation", label: "Outstation", Icon: MapPin },
    { id: "local", label: "Local", Icon: Clock3 },
    { id: "airport", label: "Airport", Icon: Plane },
  ];
  const tripLabel = tripTypes.find((type) => type.id === tripType).label;
  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!pickupDate) {
      setError("Please select a travel date.");
      return;
    }
    if (pickupDate < localDateString(new Date())) {
      setError("Travel date cannot be in the past.");
      return;
    }
    if (returnDate && returnDate < pickupDate) {
      setError("Return date must be on or after the travel date.");
      return;
    }
    if (!passengers) {
      setError("Please select the number of passengers.");
      return;
    }
    setError("");
    const message = [
      `Hello SKG Travels, I would like to check ${tripLabel.toLowerCase()} taxi rates.`,
      `Trip type: ${tripLabel}`,
      `Name: ${form.get("name")}`,
      `Pickup from: ${form.get("from")}`,
      `Travelling to: ${form.get("to")}`,
      `Travel date: ${form.get("pickupDate")}`,
      `Return date: ${form.get("returnDate") || "One way"}`,
      `Mobile no: ${form.get("mobile")}`,
      `Passengers: ${form.get("passengers")}`,
    ].join("\n");
    window.open(
      `https://wa.me/917506222999?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
  return (
    <form
      id="book"
      onSubmit={submit}
      className={hero ? "booking-form home-hero-form" : `booking-form text-ink rounded-2xl border border-t-4 border-white/70 border-t-lime-500 bg-white p-5 text-[14px] font-medium shadow-[0_16px_40px_rgba(15,44,66,.16)] sm:p-6 ${compact ? "w-full max-w-md" : "w-full max-w-[390px] lg:max-w-none"}`}
    >
      {hero && (
        <div className="home-hero-tabs" aria-label="Booking type">
          {tripTypes.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={tripType === id}
              className={tripType === id ? "home-hero-tab is-active" : "home-hero-tab"}
              onClick={() => setTripType(id)}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
      <label className="block">
        Name :
        <input className={inputClass} name="name" placeholder="Name" autoComplete="name" required />
      </label>
      <div className="mt-3">
        <span>Pickup from :</span>
        <CityAutocomplete label="Pickup location" name="from" placeholder="Pickup Location" />
      </div>
      <div className="mt-3">
        <span>Travelling to :</span>
        <CityAutocomplete label="Drop location" name="to" placeholder="Drop Location" />
      </div>
      <div className="booking-form-pair mt-3">
        <div>
          <span>Travel Date :</span>
          <BookingCalendar label="Travel date" placeholder="Select date" value={pickupDate} onChange={(date) => {
            setPickupDate(date);
            if (returnDate && returnDate < date) setReturnDate("");
          }} />
          <input type="hidden" name="pickupDate" value={pickupDate} />
        </div>
        <div>
          <span>Return Date :</span>
          <BookingCalendar label="Return date" placeholder="Select date" value={returnDate} onChange={setReturnDate} minDate={pickupDate} alignEnd />
          <input type="hidden" name="returnDate" value={returnDate} />
        </div>
      </div>
      <div className="booking-form-pair booking-form-pair-contact mt-3">
        <label>
          Mobile no :
          <input
            className={inputClass}
            name="mobile"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            placeholder="10 Digit Mobile no"
            autoComplete="tel"
            required
          />
        </label>
        <div>
          <span>How Many Passengers :</span>
          <BookingDropdown
            label="Number of passengers"
            placeholder="Select passengers"
            options={passengerOptions}
            value={passengers}
            onChange={setPassengers}
            Icon={ChevronDown}
          />
          <input type="hidden" name="passengers" value={passengers} />
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="bg-brand hover:bg-brand-dark mt-5 w-full rounded-lg px-3 py-3 font-bold text-white transition-colors"
      >
        Check {hero ? tripLabel : "Outstation"} Taxi Rates
      </button>
    </form>
  );
}
