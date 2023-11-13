import React from "react";
import useClientStore from "../../zustand/ClientStore";
import useVendorStore from "../../zustand/VendorStore";
import { Container } from "@mui/material";

function FeatureSection() {
  const { authenticated } = useClientStore();
  const { vendorAuthenticated } = useVendorStore();
  if (!authenticated) return <></>;
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "3rem",
      }}
    >
      Insert Featured Activities Here 
    </Container>
  );
}

export default FeatureSection;
