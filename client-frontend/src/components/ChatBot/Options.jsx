import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";

const Options = ({ options }) => {
  return (
    <Paper elevation={3}>
      <Typography
        p={1}
        variant="subtitle1"
        color="secondary"
        fontWeight={700}
        textAlign="center"
      >
        Enter an option (e.g. 1a):
      </Typography>
      <List>
        {options.map((option, index) => (
          <Box key={index}>
            <ListItem>
              <ListItemText primary={option} style={{ color: "#5C4B99" }} />
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>
    </Paper>
  );
};

export default Options;
