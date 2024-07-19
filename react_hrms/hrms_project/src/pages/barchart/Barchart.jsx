import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BarChart } from "@mui/x-charts/BarChart";
import Box from "@mui/material/Box";
import { getLeavesData } from "../../store/leaves";
import Footer from "../../components/Footer";
import Header from "../../components";
import { AppBar, Toolbar } from "@mui/material";
import TemporaryDrawer from "../Home/SideBar";

export default function BarAnimation() {
  const dispatch = useDispatch();
  const series = useSelector((state) => state.leaves.series);
  console.log(series, "series");

  useEffect(() => {
    dispatch(getLeavesData());
    console.log("API called");
  }, [dispatch]);

  const formattedSeries = [
    {
      name: "Leave Taken",
      data: series.map((s) => s.leave_taken),
    },
  ];

  const xAxisData = series.map((s) => s.firstname);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <TemporaryDrawer />
          <Header />
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        {series.length > 0 && (
          <BarChart
            height={300}
            xAxis={[{ scaleType: "band", data: xAxisData }]}
            series={formattedSeries}
          />
        )}
      </Box>
      <Footer />
    </>
  );
}
