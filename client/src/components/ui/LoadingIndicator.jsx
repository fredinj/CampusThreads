import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function LoadingIndicator() {
  return (
    // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 20 }}>
      <CircularProgress color={"inherit"} sx={{ m: 5 }} />
    // </div>
  );
}

export default LoadingIndicator;