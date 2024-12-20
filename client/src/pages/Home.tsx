import axios from "axios";
import { useEffect } from "react";
import { useRebybRedux } from "rebyb-redux";
import { InitialState } from "../Store";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { dispatch } = useRebybRedux<InitialState>();
  const navigate = useNavigate();
  const initial = async () => {
    try {
      // dispatch("loading", true);
      const { data } = await axios.get(
        "/api/user",

        {
          withCredentials: true,
        }
      );
      // console.log({ data });
      if (data.success) {
        dispatch("user", data.user);
        navigate("/chat");
      }
      if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.log("at checkUser function:", error);
      navigate("/unauthorized");
      if (axios.isAxiosError(error)) {
      } else {
      }
    }
  };

  useEffect(() => {
    initial();
    // cleanup function
    return () => {
      // cleanup code here
    };
  });

  return <div>Home</div>;
};

export default Home;
