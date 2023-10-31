import { useEffect } from "react";
import useClientStore from "../zustand/ClientStore";
import useVendorStore from "../zustand/VendorStore";
import useGlobalStore from "../zustand/GlobalStore";
import AxiosConnect from "./AxiosConnect";
import useChatStore from "../zustand/ChatStore";

const SocketConnection = () => {
  const { setAuthenticated, setClient } = useClientStore();
  const { setVendor, setVendorAuthenticated } = useVendorStore();
  const { setRole } = useGlobalStore();
  const { setUser } = useChatStore();
  const initialiseData = async () => {
    try {
      const response = await AxiosConnect.post("/gleek/validateToken");
      const data = response.data;

      if (data.hasOwnProperty("client")) {
        setAuthenticated(true);
        setClient(data.client);
        setRole("Client");
        setVendor(null);
        setVendorAuthenticated(null);
        setUser(data.client);
      } else if (data.hasOwnProperty("vendor")) {
        setVendorAuthenticated(true);
        setVendor(data.vendor);
        setRole("Vendor");
        setAuthenticated(false);
        setClient(null);
        setUser(data.vendor);
      }
    } catch (error) {
      console.error(error);
      setVendor(null);
      setVendorAuthenticated(null);
      setAuthenticated(false);
      setClient(null);
    }
  };

  useEffect(() => {
    initialiseData();
  }, []);

  return <></>;
};

export default SocketConnection;
