import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useState } from "react";

export default function SearchBar({ data }: { data?: string }) {
  const navigate = useNavigate();

  const [input, setInput] = useState(data ? data : "");

  const onSearchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/course-list/${input}`);
  };

  return (
    <form
      className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded-md"
      onSubmit={(e) => onSearchHandler(e)}
    >
      <img src={assets.search_icon} alt="Search icon" className="md:w-auto w-10 px-3" />
      <input
        type="text"
        placeholder="Search for courses"
        className="w-full h-full outline-none text-gray-500/80"
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <button
        type="submit"
        className="bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1"
      >
        Search
      </button>
    </form>
  );
}
