import { Flex, chakra, Box, Text } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';

const feature = config.features.adsBanner;

const CustomBanner = ({ className }: { className?: string }) => {
  const [ imageIndex, setImageIndex ] = React.useState(1);
  const [ baseUrl, setBaseUrl ] = React.useState('');
  const [ imageError, setImageError ] = React.useState(false);

  const handleImageError = React.useCallback(() => {
    setImageError(true);
  }, []);

  React.useEffect(() => {
    if (!feature.isEnabled || feature.provider !== 'custom') {
      return;
    }

    const numImages = feature.custom.config.numAds;
    setBaseUrl(feature.custom.config.baseUrl);

    const timer = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex % numImages) + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (!feature.isEnabled || feature.provider !== 'custom') {
    // Fallback UI
    return (
      <Box className={ className } id="adBanner" h={{ base: '100px', lg: '90px' }}>
        <Text>No ads available</Text>
      </Box>
    );
  }

  return (
    <Flex className={ className } id="adBanner" h={{ base: '100px', lg: '90px' }}>
      { imageError ? (
        <Text>Failed to load ad</Text>
      ) : (
        <img
          src={ `${ baseUrl }ad${ imageIndex }.jpeg` }
          alt="ad"
          onError={ handleImageError }

        />
      ) }
    </Flex>
  );
};

export default chakra(CustomBanner);
