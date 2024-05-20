import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Button } from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://your-supabase-url.supabase.co";
const supabaseKey = "your-supabase-key";
const supabase = createClient(supabaseUrl, supabaseKey);

const ProjectCard = ({ project }) => {
  const [vote, setVote] = useState(project.vote);

  const submitVote = async () => {
    await supabase.from("votes").insert({ project_id: project.id, value: vote });
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg">
      <Heading size="md">{project.title}</Heading>
      <Text mt={2}>{project.description}</Text>
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

export default ProjectCard;
