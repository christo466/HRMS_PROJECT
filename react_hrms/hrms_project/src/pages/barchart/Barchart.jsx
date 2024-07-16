import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { getLeavesData } from '../../store/leaves';
import Footer from '../../components/Footer';
import Header from '../../components';
import { AppBar, Toolbar } from '@mui/material';
import TemporaryDrawer from '../Home/SideBar';
TemporaryDrawer
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export default function BarAnimation() {
  const dispatch = useDispatch();
  const series = useSelector((state) => state.leaves.series);
  console.log(series, "series");
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [itemNb, setItemNb] = useState(5);
  const [debouncedItemNb, setDebouncedItemNb] = useState(5);

  useEffect(() => {
    dispatch(getLeavesData());
    console.log("API called");
  }, [dispatch]);

  const debouncedHandleItemNbChange = useCallback(debounce((newValue) => {
    setDebouncedItemNb(newValue);
  }, 180), []);

  const handleItemNbChange = (event, newValue) => {
    if (typeof newValue !== 'number') return;
    setItemNb(newValue);
    debouncedHandleItemNbChange(newValue);
  };

  const handleSkipAnimationChange = (event) => {
    setSkipAnimation(event.target.checked);
  };

  const formattedSeries = [{
    name: 'Leave Taken',
    data: series.slice(0, debouncedItemNb).map(s => s.leave_taken)
  }];

  const xAxisData = series.slice(0, debouncedItemNb).map(s => s.firstname);

  const marks = series.map((s, index) => ({ value: index + 1, label: s.firstname }));

  return (
    <>
    <AppBar position="static">
        <Toolbar>
         <TemporaryDrawer />
          <Header />
        </Toolbar>
      </AppBar>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', width: '100%' }}>
      {series.length > 0 && (
        <BarChart
          height={300}
          xAxis={[{ scaleType: 'band', data: xAxisData }]}
          series={formattedSeries}
          skipAnimation={skipAnimation}
        />
      )}
      <Box sx={{ width: '80%', marginTop: 4 }}>
        <Typography id="input-item-number" gutterBottom>
          Number of people
        </Typography>
        <Slider
          value={itemNb}
          onChange={handleItemNbChange}
          valueLabelDisplay="auto"
          min={1}
          max={series.length}
          marks={marks}
          step={null}
          aria-labelledby="input-item-number"
        />
        <FormControlLabel
          checked={skipAnimation}
          control={<Checkbox onChange={handleSkipAnimationChange} />}
          label="Skip Animation"
          labelPlacement="end"
        />
      </Box>
    </Box>
    <Footer/>
    </>
  );
}
