import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
   Table,
   TableBody,
   TableContainer,
   TableCell,
   TableHead,
   TableRow,
   TableFooter,
   Paper,
   Alert,
   Grid,
   Select,
   InputLabel,
   MenuItem,
} from "@mui/material/";
import FormControl from "@mui/material/FormControl";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import useBookingStore from "../../../zustand/BookingStore";
import useClientStore from "../../../zustand/ClientStore";
import useShopStore from "../../../zustand/ShopStore";

export const LeaderBoardMainPage = (props) => {
   const theme = useTheme();
   const { count, page, rowsPerPage, onPageChange } = props;

   const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
   };

   const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
   };

   const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
   };

   const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
   };

   return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
         <IconButton
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="first page">
            {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
         </IconButton>
         <IconButton
            onClick={handleBackButtonClick}
            disabled={page === 0}
            aria-label="previous page">
            {theme.direction === "rtl" ? (
               <KeyboardArrowRight />
            ) : (
               <KeyboardArrowLeft />
            )}
         </IconButton>
         <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="next page">
            {theme.direction === "rtl" ? (
               <KeyboardArrowLeft />
            ) : (
               <KeyboardArrowRight />
            )}
         </IconButton>
         <IconButton
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page">
            {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
         </IconButton>
      </Box>
   );
};

LeaderBoardMainPage.propTypes = {
   count: PropTypes.number.isRequired,
   onPageChange: PropTypes.func.isRequired,
   page: PropTypes.number.isRequired,
   rowsPerPage: PropTypes.number.isRequired,
};

export default function CustomPaginationActionsTable() {
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const { getLeaderboard } = useBookingStore();
   const { client } = useClientStore();
   const [filteredRows, setFilteredRows] = useState([]);
   const [isClientRanked, setIsClientRanked] = useState(false);
   const [filter, setFilter] = useState([]);
   const [leaderboardData, setLeaderboardData] = useState([]);
   const { themes, getThemes } = useShopStore();
   const theme = useTheme();

   const getRankedRows = (data) => {
      data.sort().reverse();
      let filteredClients = data.map((entry, index) => ({
         rank: index + 1,
         _id: entry[0].clientId._id,
         name: entry[0].clientId.companyName,
         bookings: entry.length,
      }));
      setFilteredRows(filteredClients);
      setIsClientRanked(() => {
         return filteredClients.some((c) => c._id === client?._id);
      });
   };

   const handleThemeChange = (event) => {
      const value = event.target.value;
      setFilter(value);
      let filteredLeaderboardData = [];
      if (value == "") {
         getRankedRows(leaderboardData);
      } else {
         for (let i in leaderboardData) {
            let entry = leaderboardData[i];
            let bookings = [];
            for (let j in entry) {
               const booking = entry[j];
               console.log(booking);
               if (booking.activityId.theme.name === value) {
                  bookings.push(booking);
               }
            }
            if (bookings.length) {
               filteredLeaderboardData.push(bookings);
            }
         }
         console.log(filteredLeaderboardData);
         getRankedRows(filteredLeaderboardData);
      }
   };

   useEffect(() => {
      const fetchData = async () => {
         let data = await getLeaderboard();
         setLeaderboardData(data);
         getRankedRows(data);
         await getThemes();
      };
      fetchData();
   }, [client]);

   // Avoid a layout jump when reaching the last page with empty rows.
   const emptyRows =
      page > 0
         ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length)
         : 0;

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const getRowStyle = (index) => {
      switch (index) {
         case 1:
            return { backgroundColor: "rgba(255, 215, 0, 0.5)" }; // Golden for first
         case 2:
            return { backgroundColor: "rgba(192, 192, 192, 0.5)" }; // Silver for second
         case 3:
            return { backgroundColor: "rgba(205, 133, 63, 0.5)" }; // Bronze for third
         default:
            return { backgroundColor: "transparent" }; // Default styling for other rows
      }
   };

   return (
      <Box
         flexDirection="column"
         justifyItems="center"
         display="flex"
         width={"100%"}>
         <Typography color="secondary" variant="h4" sx={{ margin: "2% auto" }}>
            Leader Board
         </Typography>
         <div style={{ width: "100%" }}>
            {/* Left Column */}
            <Grid sx={{ width: "50%", margin: "auto" }}>
               <FormControl
                  sx={{
                     width: "100%",
                     // margin: "auto",
                  }}>
                  <InputLabel>Themes:</InputLabel>
                  <Select
                     value={filter}
                     label="Theme"
                     onChange={handleThemeChange}>
                     <MenuItem key="select" value="">
                        Select a Theme
                     </MenuItem>
                     {themes?.length > 0 ? (
                        themes?.map((theme) => (
                           <MenuItem
                              key={theme.parent.name}
                              value={theme.parent.name}>
                              {theme.parent.name}
                           </MenuItem>
                        ))
                     ) : (
                        <></>
                     )}
                  </Select>
               </FormControl>
            </Grid>
            <TableContainer sx={{ width: "100%" }}>
               {isClientRanked ? (
                  <Paper
                     sx={{
                        width: "50%",
                        margin: "2% auto",
                        backgroundColor: theme.palette.primary.main,
                        p: 2,
                     }}>
                     <Typography
                        sx={{
                           color: theme.palette.secondary.main,
                           fontSize: "21px",
                           fontWeight: "bold",
                           width: "100%",
                           margin: "auto 2%",
                        }}>
                        Your Rank :{" "}
                        {
                           filteredRows.find((row) => row._id == client?._id)
                              .rank
                        }
                     </Typography>
                     {filteredRows.find((row) => row._id == client?._id).rank >
                     1 ? (
                        <Typography sx={{ width: "100%", margin: "auto 2%" }}>
                           Create more bookings to get ranked higher!
                        </Typography>
                     ) : (
                        <Typography sx={{ width: "100%", margin: "auto 2%" }}>
                           Congratulations on topping the leaderboard!
                        </Typography>
                     )}
                  </Paper>
               ) : (
                  <Alert severity="info" sx={{ width: "50%", margin: "auto" }}>
                     Create a booking to get ranked on the leaderboard
                  </Alert>
               )}
               <Table
                  sx={{ width: "50%", margin: "auto", fontSize: "18px" }}
                  aria-label="custom pagination table">
                  <TableHead>
                     <TableRow>
                        <TableCell style={{ width: "20%" }} align="center">
                           <Typography
                              fontSize={"1.5rem"}
                              sx={{ color: theme.palette.primary.main }}>
                              Rank
                           </Typography>
                        </TableCell>
                        <TableCell style={{ width: "60%" }} align="left">
                           <Typography
                              fontSize={"1.5rem"}
                              sx={{ color: theme.palette.primary.main }}>
                              Company
                           </Typography>
                        </TableCell>
                        <TableCell style={{ width: "40%" }} align="center">
                           <Typography
                              fontSize={"1.5rem"}
                              sx={{ color: theme.palette.primary.main }}>
                              Bookings
                           </Typography>
                        </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {(rowsPerPage > 0
                        ? filteredRows.slice(
                             page * rowsPerPage,
                             page * rowsPerPage + rowsPerPage
                          )
                        : filteredRows
                     ).map((row) => (
                        <TableRow key={row.name} style={getRowStyle(row.rank)}>
                           <TableCell style={{ width: "20%" }} align="center">
                              <Typography
                                 fontSize={"1rem"}
                                 sx={{ color: theme.palette.secondary.main }}>
                                 {row.rank}
                              </Typography>
                           </TableCell>
                           <TableCell style={{ width: "60%" }} align="left">
                              <Typography
                                 fontSize={"1rem"}
                                 sx={{ color: theme.palette.secondary.main }}>
                                 {row.name}
                              </Typography>
                           </TableCell>
                           <TableCell style={{ width: "40%" }} align="center">
                              <Typography
                                 fontSize={"1rem"}
                                 sx={{ color: theme.palette.secondary.main }}>
                                 {row.bookings}
                              </Typography>
                           </TableCell>
                        </TableRow>
                     ))}
                     {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                           <TableCell colSpan={6} />
                        </TableRow>
                     )}
                  </TableBody>
                  <TableFooter>
                     <TableRow>
                        <TablePagination
                           rowsPerPageOptions={[
                              5,
                              10,
                              25,
                              { label: "All", value: -1 },
                           ]}
                           colSpan={3}
                           count={filteredRows.length}
                           rowsPerPage={rowsPerPage}
                           page={page}
                           SelectProps={{
                              inputProps: {
                                 "aria-label": "rows per page",
                              },
                              native: true,
                           }}
                           onPageChange={handleChangePage}
                           onRowsPerPageChange={handleChangeRowsPerPage}
                           ActionsComponent={LeaderBoardMainPage}
                        />
                     </TableRow>
                  </TableFooter>
               </Table>
            </TableContainer>
         </div>
      </Box>
   );
}
