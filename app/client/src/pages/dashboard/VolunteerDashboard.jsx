// app/client/src/pages/dashboard/VolunteerDashboard.jsx
import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const VolunteerDashboard = () => {
  return (
    <Box p={8}>
      <Heading size="lg" mb={4}>Volunteer Dashboard</Heading>
      <Text color="gray.600">
        This is a placeholder for the volunteer dashboard. You can add stats,
        upcoming opportunities, and saved events here later.
      </Text>
    </Box>
  );
};

export default VolunteerDashboard;
