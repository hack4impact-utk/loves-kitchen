import { IFlag } from '@/server/models/Volunteer';
import { Box } from '@mui/material';
import React from 'react';

interface FlagDisplayProps {
  flags: IFlag[];
}

const FlagDisplay = (props: FlagDisplayProps) => {
  return (
    <div>
      {props.flags?.map((flag, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
        >
          {/* <Typography
                sx={{
                color:
                    colorMap[flag.color as keyof typeof colorMap] || 'black',
                border: `2px solid ${
                    colorMap[flag.color as keyof typeof colorMap] || 'black'
                }`,
                width: '90%',
                padding: '3px',
                wordBreak: 'break-word',
                }}
            >
                {flag.description}
            </Typography> */}
        </Box>
      ))}
    </div>
  );
};

export default FlagDisplay;
