import { FormatQuote } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import React from "react";

const StyledPaper = styled(Paper)`
  padding: 10px;
  padding-top: 6px;
  width: 500px;
  border-radius: 10px;
  border: 1px solid rgb(159, 145, 204);
  box-shadow: 3px 3px 0px 0px rgb(159, 145, 204, 40%);
`;
function ClientTestimonial({ testimonial }) {
  return (
    <StyledPaper>
      <Card elevation={0}>
        <CardContent>
          <FormatQuote
            color="primary"
            sx={{
              fontSize: "3rem",
              transform: "scaleX(-1)",
            }}
          />

          <div
            style={{
              height: "200px",
              overflowY: "auto",

              overflowWrap: "break-word",
            }}
          >
            <Typography
              variant="h6"
              align="center"
              sx={{
                lineHeight: 1.2,
                textAlign: "justify",
                fontSize: "1.3rem",
                padding: 2,
              }}
            >
              {testimonial.testimonialBody}
            </Typography>
          </div>

          <Typography variant="body1" align="center" paddingTop={2}>
            - {testimonial.displayName}, {testimonial.clientName}
          </Typography>
        </CardContent>
      </Card>
    </StyledPaper>
  );
}

export default ClientTestimonial;
