import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Box, ListItemText, Stack, Typography } from "@mui/material";

function ReviewProfile({ client }) {
  const clientLink = `/client/${client._id}`;

  return (
    <Link
      to={clientLink}
      style={{
        textDecoration: "none",
        display: "inline-block",
        margin: 0,
      }}
    >
      <Box display="flex" alignItems="center">
        {client ? (
          <Avatar
            sx={{ width: 30, height: 30 }}
            alt={client.name}
            src={client.preSignedPhoto}
          />
        ) : (
          <Avatar sx={{ width: 30, height: 30 }} alt="Empty Avatar" />
        )}
        <Stack sx={{ marginLeft: "10px" }}>
          <Typography color="secondary" fontWeight="700" variant="h6">
            {client.name}
          </Typography>
        </Stack>
      </Box>
    </Link>
  );
}

export default ReviewProfile;
