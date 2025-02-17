const lktheme = {
  offWhite: '#fcf4e4',
  offWhiteRGBA: (percent: number) =>
    `rgba(252, 244, 228, ${percent.toFixed(0)})`, //rgb(252, 244, 228)
  darkCyan: '#055c5b',
  darkCyanRGBA: (percent: number) => `rgba(5,92,91, ${percent})`,
  brown: '#724b40',
  brownRGBA: (percent: number) => `rgba(114, 75, 64, ${percent})`,
  red: 'f30b27',
  redrgba: (percent: number) => `rgba(243, 11, 39, ${percent}%)`,
};
export default lktheme;

export const cyantable = {
  // ==================== TO ALL WHO DARE EDIT: GOOD LUCK FINDING THE RIGHT COMBINATION OF COLORS :D
  '& .MuiDataGrid-cell': {
    color: 'white', // White text for cells
  },
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: 'rgb(4,72,71)', // Alternating row color
  },
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: 'rgb(4,62,61)', // Alternating row color
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'rgb(4,72,71)', // Column headers background
  },
  '& .MuiDataGrid-columnHeader': {
    color: 'white', // REAL column header background >:(
    backgroundColor: 'rgb(4,52,51)',
  },
  '& .MuiDataGrid-toolbarContainer': {
    backgroundColor: 'rgb(4,52,51)', // Toolbar background
    color: 'white', // Toolbar text color
  },
  '& .MuiToolbar-root': {
    backgroundColor: 'rgb(4,52,51)', // Ensuring the toolbar has a white background
    color: 'white',
  },
  '& .MuiDataGrid-toolbarButton': {
    color: 'rgb(4,52,51)', // Toolbar button text color
    backgroundColor: 'white',
  },
  '& .MuiDataGrid-filler': {
    // MORE column header background
    backgroundColor: 'rgb(4,52,51)',
  },
  '&, [class^=MuiDataGrid]': {
    border: 'none',
  },
  '& .MuiDataGrid-footerContainer': {
    backgroundColor: 'rgb(4,52,51)',
    color: 'white',
  },
  '& .MuiSelect-icon': {
    fill: 'white',
  },
  '& .MuiButtonBase-root': {
    color: 'white',
  },
};

export const browntable = {
  '& .MuiDataGrid-cell': {
    color: 'white', // White text for cells
  },
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: '#664036', // Alternating row color
  },
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: '#5C382E', // Alternating row color
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#664036', // Column headers background
  },
  '& .MuiDataGrid-columnHeader': {
    color: 'white', // REAL column header background >:(
    backgroundColor: '#522F26',
  },
  '& .MuiDataGrid-toolbarContainer': {
    backgroundColor: '#522F26', // Toolbar background
    color: 'white', // Toolbar text color
  },
  '& .MuiToolbar-root': {
    backgroundColor: '#522F26', // Ensuring the toolbar has a white background
    color: 'white',
  },
  '& .MuiDataGrid-toolbarButton': {
    color: 'rgb(4,52,51)', // Toolbar button text color
    backgroundColor: 'white',
  },
  '& .MuiDataGrid-filler': {
    // MORE column header background
    backgroundColor: '#522F26',
  },
  '&, [class^=MuiDataGrid]': {
    border: 'none',
  },
  '& .MuiDataGrid-footerContainer': {
    backgroundColor: '#522F26',
    color: 'white',
  },
  '& .MuiSelect-icon': {
    fill: 'white',
  },
  '& .MuiButtonBase-root': {
    color: 'white',
  },
};
