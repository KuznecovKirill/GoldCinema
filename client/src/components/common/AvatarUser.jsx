import { Avatar } from '@mui/material'
import React from 'react'

const AvatarUser = ({user}) => {
    const stringColor = (s) => {
        let hash = 0;
        let i;
        for (i = 0; i < s.length; i += 1){
            hash = s.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = "#";

        for (i = 0; i < 3; i +=1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    };

  return (
    <Avatar 
    sx={{
        backgroundColor: stringColor(user),
        width: 40,
        height: 40
    }}
    children={`${user.split(" ")[0][0]}`}
    />
  );
};

export default AvatarUser