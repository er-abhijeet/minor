import { useEffect, useState, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import BottomNavigation from "./BottomNavigation";
import UserContext from "../context/UserContext";
import HealthGraph from "./HealthGraph";
import { format } from "date-fns"; // You'll need to install date-fns
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Analytics({
  targetCalories = 2000,
  targetProtein = 100,
  targetCarbs = 250,
}) {
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const { ipad } = useContext(UserContext);
  const ip = ipad; // for backend
    const { user } = useContext(UserContext);
  const userId = user[0];
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const res = await fetch(`${ip}/api/graphdata/${userId}`);
        const result = await res.json();
        setLineData(result.lineData || []);
        setPieData(result.pieData || []);
      } catch (err) {
        console.error("Error fetching graph data:", err);
      }
    };

    if (userId) fetchGraphData();
  }, [userId]);

  const renderLineChart = (dataKey, label, target) => (
    <div className="w-full md:w-1/2 p-4">
      <h3 className="text-lg font-semibold mb-2">{label} (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
  dataKey="date"
  tickFormatter={(tick) => format(new Date(tick), "MMM d, HH:mm")}
/>
          <YAxis />
          <Tooltip
  labelFormatter={(label) => format(new Date(label), "MMM d, yyyy - HH:mm")}
/>
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
          <Line
            type="monotone"
            dataKey={() => target}
            stroke="#ff0000"
            strokeDasharray="5 5"
            name="Target"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      <div className="flex flex-wrap justify-center">
        {renderLineChart("calories", "Calories", targetCalories)}
        {renderLineChart("protein", "Protein (g)", targetProtein)}
        {renderLineChart("carbs", "Carbs (g)", targetCarbs)}

        <div className="w-full md:w-1/2 p-4">
          <h3 className="text-lg font-semibold mb-2">
            Food Item Proportions (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <HealthGraph />
      <BottomNavigation act="analytics" />
    </>
  );
}

function dataToWeeks(data) {
  const weeks = {};
  data.forEach(({ date, calories, protein, carbs }) => {
    const week = `W${Math.ceil(new Date(date).getDate() / 7)}`;
    if (!weeks[week])
      weeks[week] = { week, calories: 0, protein: 0, carbs: 0, count: 0 };
    weeks[week].calories += calories;
    weeks[week].protein += protein;
    weeks[week].carbs += carbs;
    weeks[week].count += 1;
  });
  return Object.values(weeks).map((w) => ({
    week: w.week,
    calories: Math.round(w.calories / w.count),
    protein: Math.round(w.protein / w.count),
    carbs: Math.round(w.carbs / w.count),
  }));
}

export default Analytics;
