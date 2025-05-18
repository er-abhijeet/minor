import { useEffect, useState, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import UserContext from "../context/UserContext";
import { format } from "date-fns";

const HealthGraph = () => {
  const [parameters, setParameters] = useState([]);
  const [selectedParam, setSelectedParam] = useState("");
  const [data, setData] = useState([]);
  const { ipad } = useContext(UserContext);
  const ip = ipad; // for backend
  const { user } = useContext(UserContext);
  const userId = user[0];

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const res = await fetch(`${ip}/api/healthgraphdata/${userId}`);
        const json = await res.json();
        
        if (json.parameters.length > 0) {
          setParameters(json.parameters);
          setSelectedParam(json.parameters[0]); // Default selection
          setData(json.data);
        }
      } catch (err) {
        console.error("Error fetching health data", err);
      }
    };

    fetchHealthData();
  }, [userId]);

  const handleChange = (e) => {
    setSelectedParam(e.target.value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow mb-16">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Health Parameter Trends
      </h2>

      <div className="mb-4 text-center">
        <label htmlFor="parameter" className="mr-2 font-medium">
          Select Parameter:
        </label>
        <select
          id="parameter"
          value={selectedParam}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          {parameters.map((param) => (
            <option key={param} value={param}>
              {param.charAt(0).toUpperCase() + param.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {selectedParam && data[selectedParam]?.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data[selectedParam]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(tick) => format(new Date(tick), "MMM d, HH:mm")}
            />

            <YAxis />
            <Tooltip
              labelFormatter={(label) =>
                format(new Date(label), "MMM d, yyyy - HH:mm")
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">No data to display.</p>
      )}
    </div>
  );
};

export default HealthGraph;
