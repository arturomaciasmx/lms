import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useClerk, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useAppContext } from "../../context/AppContext";

export default function Navbar() {
  const { openSignIn } = useClerk();
  const { navigate } = useAppContext();
  const isCoursesList = location.pathname.includes("course-list");

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCoursesList ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img
        src={assets.logo}
        alt="Logo"
        className="w-28 lg:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* desktop */}
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          <SignedIn>
            <button>Become educator</button>
            <Link to={"/my-enrollments"}>My enrollments</Link>
          </SignedIn>
        </div>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
            onClick={() => openSignIn()}
          >
            Create account
          </button>
        </SignedOut>
      </div>

      {/* mobile */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-2 text-xs">
          <SignedIn>
            <button>Become educator</button>
            <Link to={"/my-enrollments"}>My enrollments</Link>
          </SignedIn>
        </div>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="User icon" />
          </button>
        </SignedOut>
      </div>
    </div>
  );
}
