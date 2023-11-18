import { Skeleton, Stack } from "@mui/material";

const AdminChatLoading = () => {
  return (
    <Stack spacing={2} width={{ md: "100%" }} height={{ md: "100%" }}>
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
    </Stack>
  );
};

export default AdminChatLoading;
