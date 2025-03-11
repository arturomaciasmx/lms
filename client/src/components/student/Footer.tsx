import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

export default function Footer() {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full text-white">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
        <div className="flex flex-col md:items-start items-center w-full">
          <img src={assets.logo_dark} alt="Logo" />
          <p className="mt-6 text-center md:text-left">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text.
          </p>
        </div>
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="text-white mb-5 text-xl">Company</h2>
          <ul className="flex md:flex-col w-full justify-between md:space-y-2">
            <li>
              <Link to="#">Home</Link>
            </li>
            <li>
              <Link to="#">About us</Link>
            </li>
            <li>
              <Link to="#">Contact us</Link>
            </li>
            <li>
              <Link to="#">Privacy policy</Link>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="text-white mb-5 text-xl">Subscribe to our newsletter</h2>
          <p className="text-sm text-white/80">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className="flex items-center gap-2 pt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-500/30 bg-gray-800 text-gray-500 placeholder:gray-500 outline-none w-64 h-9 rounded px-2 text-sm"
            />
            <button className="bg-blue-600 w-2/4 h-9 text-white rounded">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <p className="text-sm text-white/60 text-center p-2">
        Copyright 2024 © Edemy. All Right Reserved.
      </p>
    </footer>
  );
}
