"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = "Search by artist, team, event or venue",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-[672px] bg-white rounded-full shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.1)] pl-8 pr-4 py-4"
    >
      {/* Input Field */}
      <div className="flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent font-outfit font-light text-lg text-black placeholder:text-[#666666] outline-none"
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="ml-4 flex items-center justify-center w-14 h-14 bg-tp-blue rounded-full shrink-0 transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
        aria-label="Search"
      >
        <Search className="w-6 h-6 text-white" strokeWidth={2.5} />
      </button>
    </form>
  );
}




