import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import useAuthStore from "../store/auth";
import { signOut } from "firebase/auth";
import MyList from "../components/MyList";

function Main() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <div>
      <Map />
      <MyList />
    </div>
  );
}

export default Main;
