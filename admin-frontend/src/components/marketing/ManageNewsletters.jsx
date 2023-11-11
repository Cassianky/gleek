import React, { useState } from "react";
import { useTheme } from "@emotion/react";
import { useBookingStore, useSnackbarStore } from "../../zustand/GlobalStore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import MainBodyContainer from "../common/MainBodyContainer";

const ManageNewsletters = () => {
  const theme = useTheme();
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const { openSnackbar } = useSnackbarStore();
//   const { updateBookingToPaid } = useBookingStore();

//   const handleDialogOpen = (event) => {
//     event.stopPropagation();
//     setDialogOpen(true);
//   };

//   const handleDialogClose = () => {
//     setDialogOpen(false);
//   };

//   const handleConfirm = async (bookingId) => {
//     try {
//       const message = await updateBookingToPaid(bookingId);
//       openSnackbar(message);
//       handleDialogClose();
//     } catch (error) {
//       openSnackbar(error.message, "error");
//     }
//   };

//   const confirmationDisplayDetails = [
//     { label: "Client Company", value: bookingData.clientId.companyName },
//     { label: "Vendor", value: bookingData.vendorName },
//     { label: "Activity", value: bookingData.activityTitle },
//     {
//       label: "Date",
//       value: new Date(bookingData.startDateTime).toLocaleDateString(),
//     },
//     {
//       label: "Timeslot",
//       value: `${new Date(
//         bookingData.startDateTime,
//       ).toLocaleTimeString()} - ${new Date(
//         bookingData.endDateTime,
//       ).toLocaleTimeString()}`,
//     },
//     { label: "Total Cost", value: `$${bookingData.totalCost}` },
//   ];

  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Manage Newsletters"}
    >
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        Manage Newsletters
      </Typography>
    </MainBodyContainer>
    // <div>
    //   <Button variant="contained" color="success" onClick={handleDialogOpen}>
    //     Paid
    //   </Button>

    //   <Dialog open={dialogOpen} onClose={handleDialogClose}>
    //     <DialogTitle>Confirm Payment</DialogTitle>
    //     <DialogContent>
    //       {confirmationDisplayDetails.map((detail, index) => (
    //         <div key={index}>
    //           <Typography>
    //             <span
    //               style={{
    //                 fontWeight: "bold",
    //                 color: theme.palette.dark_purple.main,
    //               }}
    //             >
    //               {detail.label}:{" "}
    //             </span>
    //             {detail.value}
    //           </Typography>
    //         </div>
    //       ))}

    //       <DialogContentText sx={{ pt: 2 }}>
    //         Are you sure you want to mark this booking as paid?
    //       </DialogContentText>
    //     </DialogContent>
    //     <DialogActions>
    //       <Button onClick={handleDialogClose} color="primary">
    //         Cancel
    //       </Button>
    //       <Button
    //         onClick={async () => await handleConfirm(bookingData.id)}
    //         color="primary"
    //       >
    //         Confirm
    //       </Button>
    //     </DialogActions>
    //   </Dialog>
    // </div>
  );
};

export default ManageNewsletters;
