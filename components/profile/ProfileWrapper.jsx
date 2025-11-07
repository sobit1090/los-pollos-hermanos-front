import { useSelector } from "react-redux";
import Profile from "./Profile";
import AdminProfile from "./AdminProfile";

export default function ProfileWrapper() {
  const { user } = useSelector((state) => state.auth);

  // If user not loaded yet, avoid render errors
  if (!user) return null;

  return user.role === "admin" ? <AdminProfile /> : <Profile />;
}
