import { useSelector } from "react-redux";
import Profile from "./Profile";

export default function ProfileWrapper() {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return <Profile />;
}