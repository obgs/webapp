import { Box, Grid, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

const Label: React.FC<PropsWithChildren> = ({ children }) => (
  <Grid item xs={4}>
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        height: "100%",
      }}
    >
      <Typography variant="body2">{children}</Typography>
    </Box>
  </Grid>
);

export default Label;
