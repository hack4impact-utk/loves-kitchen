import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { IVolunteer } from '@/server/models/Volunteer';

interface SearchBarProps {
  volunteers: IVolunteer[];
  setData: (data: IVolunteer[]) => void;
}

export default function SearchBar({ volunteers, setData }: SearchBarProps) {
  // State to store the input value
  const [inputValue, setInputValue] = React.useState('');

  // Event handler to update the state when input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // You can access the inputValue here to use it wherever needed
  const handleSearch = () => {
    const filteredData = volunteers.filter((volunteer) =>
      `${volunteer.firstName} ${volunteer.lastName}`
        .toLowerCase()
        .includes(inputValue.toLowerCase())
    );
    setData(filteredData);
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search when Enter key is pressed
    }
  };

  return (
    <Paper
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        mb: 2,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search for volunteers"
        value={inputValue} // Bind the value of InputBase to the state
        onChange={handleInputChange} // Handle the input changes
        onKeyDown={handleKeyDown}
        inputProps={{ 'aria-label': 'search volunteers' }}
      />
      <IconButton
        type="button"
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={handleSearch}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
