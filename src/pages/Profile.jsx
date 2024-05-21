import React, { useState, useEffect } from "react";
import { Box, Heading, Text, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://your-supabase-url.supabase.co";
const supabaseKey = "your-supabase-key";
const supabase = createClient(supabaseUrl, supabaseKey);

const Profile = () => {
  const [profile, setProfile] = useState({ name: "", preferences: "" });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("profiles").select("*").single();
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      setProfile(data);
    };
    fetchData();
  }, []);

  const updateProfile = async () => {
    const { error } = await supabase.from("profiles").update(profile).eq("id", profile.id);
    if (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" bg="white" boxShadow="md">
      <Heading size="md">User Profile</Heading>
      <FormControl mt={4}>
        <FormLabel>Name</FormLabel>
        <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Preferences</FormLabel>
        <Input value={profile.preferences} onChange={(e) => setProfile({ ...profile, preferences: e.target.value })} />
      </FormControl>
      <Button mt={4} onClick={updateProfile}>
        Update Profile
      </Button>
    </Box>
  );
};

export default Profile;
