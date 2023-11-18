import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import ChatOptions from "./ChatOptions";

const OptionsWithState = ({ stepOptions, step }) => {
  // Local state to hold options
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let result = ChatOptions;

    if (result) {
      for (let i = 0; i <= stepOptions; i++) {
        if (result[step[i]]?.hasOwnProperty("options")) {
          result = result[step[i]].options;
        } else if (result[step[i]]) {
          result = result[step[i]];
        }
      }

      setOptions(Object.entries(result).map(([key, value]) => value.label));
    }
  }, [stepOptions]);

  return (
    <Paper elevation={3}>
      <Typography
        p={1}
        variant="subtitle1"
        color="secondary"
        fontWeight={700}
        textAlign="center"
      >
        {`Enter an option (e.g. ${stepOptions + 1}a):`}
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

export default OptionsWithState;
