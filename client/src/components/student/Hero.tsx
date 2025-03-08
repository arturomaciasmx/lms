import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center pt-36 w-full px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70">
      <h1 className="relative font-bold text-5xl max-w-3xl mx-auto">
        Empower your future with the courses designed to{" "}
        <span className="text-blue-600">fit your choice.</span>
        <img
          src={assets.sketch}
          alt="Sketch"
          className="md:block hidden absolute -bottom-7 right-0"
        />
      </h1>
      <p className="text-lg max-w-2xl mx-auto mt-5">
        We bring together world-class instructors, interactive content, and a supportive
        community to help you achieve your personal and professional goals.
      </p>
      <SearchBar />
    </div>
  );
}
