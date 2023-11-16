import { useEffect } from "react";
import {
  useAdminStore,
  useChatStore,
  useNotificationStore,
} from "../zustand/GlobalStore.js";
import AxiosConnect from "./AxiosConnect.js";

const SocketConnection = () => {
  const { setAuthenticated, setAdmin, admin } = useAdminStore();
  const { retrieveAndSetAllNotifications } = useNotificationStore();
  const { retrieveAndSetAllChatRooms } = useChatStore();
  const initialiseData = async () => {
    try {
      const response = await AxiosConnect.post("/gleekAdmin/validate-token");
      const data = response.data;
      setAuthenticated(true);
      setAdmin(data.admin);
      retrieveAndSetAllNotifications();
      retrieveAndSetAllChatRooms();
    } catch (error) {
      setAuthenticated(false);
      setAdmin(null);
    }
  };

  useEffect(() => {
    initialiseData();
  }, [retrieveAndSetAllNotifications, retrieveAndSetAllChatRooms]);

  return <></>;
};

export default SocketConnection;
