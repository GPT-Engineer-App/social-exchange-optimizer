import { Link } from "react-router-dom";
import { HStack, Button } from "@chakra-ui/react";

const Navigation = () => {
  return (
    <HStack spacing={4} p={4} borderBottomWidth={1} bg="gray.100" boxShadow="md">
      <Button as={Link} to="/">
        Home
      </Button>
      <Button as={Link} to="/profile">
        Profile
      </Button>
    </HStack>
  );
};

export default Navigation;
