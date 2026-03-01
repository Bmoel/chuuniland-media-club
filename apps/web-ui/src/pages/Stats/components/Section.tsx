import { Box, Divider, Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";

function Section({ title, children, headerAction }: { title: string; children: ReactNode; headerAction?: ReactNode }) {
    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box px={2} py={1} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
                {headerAction}
            </Box>
            <Divider />
            <Box p={2}>
                {children}
            </Box>
        </Paper>
    );
}

export default Section;
