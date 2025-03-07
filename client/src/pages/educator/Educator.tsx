import { Outlet } from "react-router-dom";

export default function Educator() {
  return (
    <>
      Educator
      <div>{<Outlet />}</div>
    </>
  );
}
