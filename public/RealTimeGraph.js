import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const RealTimeGraph = ({ data, type }) => {
  const getYAxisLabel = () => {
    switch(type) {
      case 'voltage': return 'Voltage (V)';
      case 'power': return 'Power (W)';
      case 'temperature': return 'Temperature (°C)';
      default: return '';
    }
  };

  const renderLines = () => {
    if (type === 'temperature') {
      return (
        <>
          <Line 
            type="monotone" 
            dataKey="motor" 
            stroke="#8884d8" 
            name="Motor"
          />
          <Line 
            type="monotone" 
            dataKey="controller" 
            stroke="#82ca9d" 
            name="Controller"
          />
          <Line 
            type="monotone" 
            dataKey="HV_max" 
            stroke="#ffc658" 
            name="HV Max"
          />
        </>
      );
    }
    return (
      <Line 
        type="monotone" 
        dataKey="value" 
        stroke="#8884d8" 
      />
    );
  };

  return (
    <div className="w-full h-96 bg-white p-4 rounded-lg shadow">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleTimeString();
            }}
          />
          <YAxis label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleString()}
          />
          <Legend />
          {renderLines()}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RealTimeGraph;