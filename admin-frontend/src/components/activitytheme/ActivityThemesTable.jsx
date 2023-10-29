import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  Chip,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import React, { useState } from "react";
import EditThemeModal from "./EditThemeModal";

const ActivityThemesTable = ({ themes, updateTheme, openSnackbar }) => {
  const theme = useTheme();
  const [popoveropen, setPopoverOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState();
  const [allthemes, setAllThemes] = useState([]);

  const handleMoreButton = (row, allthemes) => {
    console.log(row, allthemes);
    setCurrentRow(row);
    setAllThemes(allthemes);
    setPopoverOpen((prev) => !prev);
  };

  const [filteredThemes, setFilteredThemes] = useState(
    themes?.data?.filter((t) => t?.parent !== null)
  );

  const handleClose = () => {
    setPopoverOpen((prev) => !prev);
  };

  const Row = ({ row }) => {
    const [open, setOpen] = useState();
    return (
      <React.Fragment>
        <TableRow
          sx={{
            "& > *": { borderBottom: "unset" },
          }}
        >
          <TableCell width={"16%"}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell width={"34%"}>{row.parent.name}</TableCell>
          <TableCell width={"34%"}>
            <Chip
              label={
                <Typography fontSize={"0.875rem"} color="white">
                  {row.parent.status}
                </Typography>
              }
              sx={{
                backgroundColor:
                  row.parent.status === "Active"
                    ? theme.palette.success.light
                    : theme.palette.error.main,
              }}
            />
          </TableCell>
          <TableCell width={"16%"}>
            <IconButton onClick={() => handleMoreButton(row.parent, themes)}>
              <MoreHorizIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              paddingLeft: 0,
              paddingRight: 0,
            }}
            colSpan={6}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: alpha(
                          theme.palette.light_purple.main,
                          0.12
                        ),
                      }}
                    >
                      <TableCell width={"16%"} />
                      <TableCell width={"34%"}>
                        <Typography
                          fontSize={"1rem"}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          Learning Point
                        </Typography>
                      </TableCell>
                      <TableCell width={"34%"}>
                        <Typography
                          fontSize={"1rem"}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          Status
                        </Typography>
                      </TableCell>
                      <TableCell width={"16%"} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.children?.map((subtheme, index) => (
                      <TableRow key={index}>
                        <TableCell />
                        <TableCell>{subtheme.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              <Typography fontSize={"0.875rem"} color="white">
                                {subtheme?.status}
                              </Typography>
                            }
                            sx={{
                              backgroundColor:
                                subtheme?.status === "Active"
                                  ? theme.palette.success.light
                                  : theme.palette.error.main,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              handleMoreButton(subtheme, row.children)
                            }
                          >
                            <MoreHorizIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  Row.propTypes = {
    row: PropTypes.shape({
      parent: PropTypes.shape({
        name: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
      }).isRequired,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          status: PropTypes.string.isRequired,
        })
      ),
    }).isRequired,
  };

  return (
    <Box>
      <div style={{ height: 500, width: "99%" }}>
        <TableContainer
          sx={{
            borderRadius: "10px",
            boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
            border: "2px solid rgb(159 145 204 / 40%)",
            backgroundColor: "white",
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
          }}
          component={Paper}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: alpha(theme.palette.light_purple.main, 0.12),
                }}
              >
                <TableCell />
                <TableCell>
                  <Typography
                    fontSize={"1rem"}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    Theme
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontSize={"1rem"}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    Status
                  </Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredThemes?.map((row, index) => (
                <Row key={index} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <EditThemeModal
          open={popoveropen}
          handleOpen={handleClose}
          currentTheme={currentRow}
          allThemes={allthemes}
          updateTheme={updateTheme}
          openSnackbar={openSnackbar}
        />
      </div>
    </Box>
  );
};

ActivityThemesTable.propTypes = {
  themes: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        parent: PropTypes.shape({
          name: PropTypes.string.isRequired,
          status: PropTypes.string.isRequired,
        }),
        children: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
          })
        ),
      })
    ),
  }),
  updateTheme: PropTypes.func.isRequired,
  openSnackbar: PropTypes.func.isRequired,
};
export default ActivityThemesTable;
