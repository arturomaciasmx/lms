import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

export default function Sidebar() {
  const { isEducator } = useAppContext();
  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon },
    { name: "Add courses", path: "/educator/add-courses", icon: assets.add_icon },
    { name: "My courses", path: "/educator/my-courses", icon: assets.my_course_icon },
    {
      name: "Students enrolled",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];
  return (
    isEducator && (
      <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500">
        {menuItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            end={item.path === "/educator"}
            className={({ isActive }) =>
              `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${
                isActive
                  ? "bg-indigo-50 border-r-[6px] border-indigo-500/90"
                  : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
              }`
            }
          >
            <img src={item.icon} alt={item.name} className="w-6 h-6" />
            <p className="md:block hidden text-center">{item.name}</p>
          </NavLink>
        ))}
      </div>
    )
  );
}
