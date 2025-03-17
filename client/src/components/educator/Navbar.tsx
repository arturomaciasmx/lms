import { UserButton, useUser } from "@clerk/clerk-react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { Link } from "react-router-dom";

export default function Navbar() {
  const educatorData = dummyEducatorData;
  const user = useUser();
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
      <Link to="/">
        <img src={assets.logo} alt="Logo" />
      </Link>
      <div className="flex items-center gap-5 text-gray-500">
        <p>Hi! {user ? user.user?.fullName : "Developers"}</p>
        {user ? <UserButton /> : <img src={assets.profile_img} className="max-w-8" />}
      </div>
    </div>
  );
}
