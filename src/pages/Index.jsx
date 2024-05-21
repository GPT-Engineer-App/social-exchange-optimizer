import React, { useState, useEffect } from "react";
import { ChakraProvider, Box, Button, Input, FormControl, FormLabel, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Switch, Text, VStack, HStack, Heading } from "@chakra-ui/react";
import ProjectCard from "./ProjectCard";
import { FaUser, FaHeart, FaVoteYea, FaCheck } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://your-supabase-url.supabase.co";
const supabaseKey = "your-supabase-key";
const supabase = createClient(supabaseUrl, supabaseKey);

const UserProfile = () => {
  const [profile, setProfile] = useState({ name: "", preferences: "" });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("profiles").select("*").single();
      setProfile(data);
    };
    fetchData();
  }, []);

  const updateProfile = async () => {
    await supabase.from("profiles").update(profile).eq("id", profile.id);
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

const MatchingComponent = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await supabase.from("matches").select("*");
      setMatches(data);
    };
    fetchMatches();

    const subscription = supabase
      .from("matches")
      .on("INSERT", (payload) => {
        setMatches((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" bg="white" boxShadow="md">
      <Heading size="md">Matches</Heading>
      <VStack mt={4}>
        {matches.map((match) => (
          <Box key={match.id} p={2} borderWidth={1} borderRadius="md" w="100%">
            {match.name}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

const VotingSlider = () => {
  const [vote, setVote] = useState(0);

  const submitVote = async () => {
    const { error } = await supabase.from("votes").insert({ value: vote });
    if (error) {
      console.error("Error submitting vote:", error);
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" bg="white" boxShadow="md">
      <Heading size="md">Vote on Projects</Heading>
      <Slider mt={4} value={vote} onChange={setVote} min={0} max={100}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Button mt={4} onClick={submitVote}>
        Submit Vote
      </Button>
    </Box>
  );
};

const ConsentForm = () => {
  const [consent, setConsent] = useState(false);

  const submitConsent = async () => {
    await supabase.from("consents").insert({ consent });
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" bg="white" boxShadow="md">
      <Heading size="md">User Consent</Heading>
      <FormControl display="flex" alignItems="center" mt={4}>
        <FormLabel htmlFor="consent" mb="0">
          Consent to data collection
        </FormLabel>
        <Switch id="consent" isChecked={consent} onChange={(e) => setConsent(e.target.checked)} />
      </FormControl>
      <Button mt={4} onClick={submitConsent}>
        Submit Consent
      </Button>
    </Box>
  );
};

const Index = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) {
        console.error("Error fetching projects:", error);
        return;
      }
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <ChakraProvider>
      <VStack spacing={8} p={8}>
        <HStack spacing={8}>
          <UserProfile />
          <MatchingComponent />
        </HStack>
        <HStack spacing={8}>
          <VotingSlider />
          <ConsentForm />
        </HStack>
        <VStack spacing={8}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </VStack>
      </VStack>
    </ChakraProvider>
  );
};

export default Index;
