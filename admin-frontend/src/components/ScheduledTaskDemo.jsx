import AxiosConnect from "../utils/AxiosConnect";
import MainBodyContainer from "./common/MainBodyContainer";
import { Button } from "@mui/material";

const ScheduledTaskDemo = () => {
  const buttonStyle = {
    border: "1px solid #ccc",
    padding: "5px",
    marginBottom: "5px",
  };

  const handleManualCompleteBookingsUpdate = () => {
    AxiosConnect.post("/booking/updateCompletedBookings").then((response) => {
      console.log(response);
    });
  };

  const handleSendUnreadChatVendorReminder = () => {
    AxiosConnect.post("/chatroom/admin/sendUnreadChatVendorReminder").then(
      (response) => {
        console.log(response);
      },
    );
  };

  const handleDeleteRejectedClientAfterThirtyDays = () => {
    AxiosConnect.post("/client/deleteRejectedClientAfterThirtyDays").then(
      (response) => {
        console.log(response);
      },
    );
  };

  const handleDeleteRejectedVendorAfterThirtyDays = () => {
    AxiosConnect.post("/vendor/deleteRejectedVendorAfterThirtyDays").then(
      (response) => {
        console.log(response);
      },
    );
  };

  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"All Notifications"}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <h2>Manual Trigger for the following Scheduled Task</h2>
        <Button
          style={buttonStyle}
          onClick={handleManualCompleteBookingsUpdate}
        >
          Update Completed Bookings from Confirmed to Pending Payment
        </Button>
        <Button
          style={buttonStyle}
          onClick={handleSendUnreadChatVendorReminder}
        >
          Send email reminder to vendor with unread chats
        </Button>
        <Button
          style={buttonStyle}
          onClick={handleDeleteRejectedClientAfterThirtyDays}
        >
          Delete clients rejected for 30 days and beyond current date
        </Button>
        <Button
          style={buttonStyle}
          onClick={handleDeleteRejectedVendorAfterThirtyDays}
        >
          Delete vendors rejected for 30 days and beyond current date
        </Button>
      </div>
    </MainBodyContainer>
  );
};

export default ScheduledTaskDemo;
