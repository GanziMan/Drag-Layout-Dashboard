import React, { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import axios from "axios";

const ResponsiveGridLayout = WidthProvider(Responsive);

const COLORS = [
  "#8884d8",
  "#83a6ed",
  "#8dd1e1",
  "#82ca9d",
  "#a4de6c",
  "#d0ed57",
];

const Dashboard = () => {
  const layouts = {
    lg: [
      { i: "chart1", x: 0, y: 0, w: 6, h: 1.5 },
      { i: "chart2", x: 7, y: 0, w: 6, h: 1.5 },
      { i: "chart3", x: 0, y: 1.5, w: 12, h: 3 },
      { i: "chart4", x: 0, y: 7.5, w: 6, h: 2 },
    ],
  };

  const [eventData, setEventData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const calculateChartData = (rows) => {
    const refererData = rows?.map((row) => ({
      name: row[0],
      value: parseInt(row[1]),
    }));

    refererData?.sort((a, b) => b.value - a.value);

    let top4ValueSum = 0;
    const top4Data = refererData?.slice(0, 4)?.map((referer) => {
      top4ValueSum += referer.value;
      return referer;
    });

    const etcValue = refererData
      ?.slice(4)
      .reduce((sum, referer) => sum + referer.value, 0);
    const etcData = { name: "etc", value: etcValue };

    return top4Data ? [...top4Data, etcData] : [];
  };

  const chart4Data = calculateChartData(pieData.rows);

  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `${value / 1000}k`;
    }
    return value;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseEvent = await axios.get(
          "https://static.adbrix.io/front/coding-test/event_1.json"
        );

        setEventData(responseEvent.data.data);

        const responsePie = await axios.get(
          "https://static.adbrix.io/front/coding-test/event_3.json"
        );
        setPieData(responsePie.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const calculateTotals = (data) => {
    let uniqueUserTotal = 0;
    let totalEventCountTotal = 0;

    data?.rows?.forEach((row) => {
      const uniqueUserCount = parseInt(row[1]);
      const totalEventCount = parseInt(row[2]);

      uniqueUserTotal += uniqueUserCount;
      totalEventCountTotal += totalEventCount;
    });

    return {
      uniqueUserTotal,
      totalEventCountTotal,
    };
  };

  const totals = calculateTotals(eventData);

  const chart3Data = eventData.rows?.map((row) => ({
    name: row[0], // 첫 번째 열이 날짜 데이터
    uv: parseInt(row[1]), // 두 번째 열이 unique_view 데이터
    pv: parseInt(row[2]), // 세 번째 열이 page_view 데이터
  }));

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h1>Dashboard</h1>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 12 }}
      >
        <div key={"chart1"} style={{ background: "white" }}>
          <div style={{ width: "100%", height: "100%", padding: "15px 30px" }}>
            <h3 style={{ color: "skyblue" }}>접속유저</h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <div
                style={{
                  color: "gray",
                  backgroundColor: "lightgray",
                  padding: "5px",
                  fontWeight: "700",
                  borderRadius: "5px",
                  border: "1px solid lightgray",
                }}
              >
                SUM
              </div>{" "}
              <div style={{ color: "gray", fontWeight: "700" }}>
                Unique Event Count
              </div>
            </div>
            <h1>{totals.uniqueUserTotal.toLocaleString()}</h1>
            <p>-93</p>
          </div>
        </div>
        <div key={"chart2"} style={{ background: "white" }}>
          <div style={{ width: "100%", height: "100%", padding: "15px 30px" }}>
            <h3 style={{ color: "skyblue" }}>접속횟수</h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <div
                style={{
                  color: "gray",
                  backgroundColor: "lightgray",
                  padding: "5px",
                  fontWeight: "700",
                  borderRadius: "5px",
                  border: "1px solid lightgray",
                }}
              >
                SUM
              </div>{" "}
              <div style={{ color: "gray", fontWeight: "700" }}>
                Total Event Count
              </div>
            </div>
            <h1>{totals.totalEventCountTotal.toLocaleString()}</h1>
            <p>-1,049</p>
          </div>
        </div>
        <div key={"chart3"} style={{ background: "white" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              width={500}
              height={400}
              data={chart3Data}
              margin={{
                top: 20,
                right: 80,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis
                dataKey="name"
                label={{
                  value: "Date",
                  position: "insideBottomRight",
                  offset: 0,
                }}
                scale="band"
              />
              <YAxis
                label={{ value: "Value", angle: -90, position: "insideLeft" }}
                tickFormatter={formatYAxis}
              />
              <Tooltip />
              <Legend />

              <Bar
                dataKey="pv"
                barSize={20}
                fill="#413ea0"
                name="Total Event Count"
              />
              <Line
                type="monotone"
                dataKey="uv"
                stroke="#ff7300"
                name="Unique Event Count"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div key={"chart4"} style={{ background: "white" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={chart4Data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {chart4Data?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;
