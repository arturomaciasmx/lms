import { Outlet } from "react-router-dom";
import Navbar from "../../components/educator/Navbar";
import Sidebar from "../../components/educator/Sidebar";

export default function Educator() {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{<Outlet />}</div>
      </div>
    </>
  );
}
