import { IFlag } from '@/server/models/Volunteer';
import { flagColorMap } from '@/types/colors';
// import { Box } from '@mui/material';
import React from 'react';

interface FlagDisplayProps {
  flags: IFlag[];
}

const FlagDisplay = (props: FlagDisplayProps) => {
  return (
    <div className="flex gap-10">
      {props.flags?.map((flag, index) => (
        <div
          key={index}
          className="px-3 rounded-full text-white py-1"
          style={{
            backgroundColor:
              flagColorMap[flag.color as keyof typeof flagColorMap],
          }}
        >
          <p>{flag.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FlagDisplay;

// <Box
//   key={index}
//   sx={{
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     mt: 1,
//   }}
// >
//   <Typography
//         sx={{
//         color:
//             colorMap[flag.color as keyof typeof colorMap] || 'black',
//         border: `2px solid ${
//             colorMap[flag.color as keyof typeof colorMap] || 'black'
//         }`,
//         width: '90%',
//         padding: '3px',
//         wordBreak: 'break-word',
//         }}
//     >
//         {flag.description}
//     </Typography>
// </Box>
