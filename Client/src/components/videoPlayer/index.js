import React, { useState } from 'react';
import { Box, Button, IconButton } from "@chakra-ui/react";
import { FaTimes } from 'react-icons/fa';

const VideoPlayer = ({ videoId }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const enterFullscreen = () => {
        setIsFullscreen(true);
        document.body.style.overflow = 'hidden'; // Disable body scroll
    };

    const exitFullscreen = () => {
        setIsFullscreen(false);
        document.body.style.overflow = 'auto'; // Re-enable body scroll
    };

    return (
        <>
            <Box
                position="relative"
                display={isFullscreen ? 'flex' : 'none'}
                alignItems="center"
                justifyContent="center"
                width="100vw"
                height="100vh"
                backgroundColor="black"
                backdropFilter="blur(5px)"
                zIndex="9999"
            >
                <iframe
                    width="80%"
                    height="80%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="Video Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
                <IconButton
                    aria-label="Close"
                    icon={<FaTimes />}
                    onClick={exitFullscreen}
                    position="absolute"
                    top="1rem"
                    right="1rem"
                    size="lg"
                    colorScheme="red"
                    borderRadius="full"
                    zIndex="10000"
                />
            </Box>

            <Box display={isFullscreen ? 'none' : 'block'}>
                <Button onClick={enterFullscreen} colorScheme="blue">
                    Play Fullscreen Video
                </Button>
            </Box>
        </>
    );
};