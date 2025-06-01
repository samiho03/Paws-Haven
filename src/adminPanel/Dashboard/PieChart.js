import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './PieChart.css';

const PieChartComponent = ({ data, title }) => {
  // Transform the dashboard data for pie chart
  const chartData = [
    {
      name: 'Pending',
      value: data.pendingRequests || 0,
      color: '#ff9500'
    },
    {
      name: 'Approved',
      value: data.approvedRequests || 0,
      color: '#28a745'
    },
    {
      name: 'Rejected',
      value: data.rejectedRequests || 0,
      color: '#dc3545'
    }
  ].filter(item => item.value > 0); // Only show segments with data

  // Custom label function
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="pie-tooltip">
          <p className="tooltip-label">{data.name}</p>
          <p className="tooltip-value">
            Count: <strong>{data.value}</strong>
          </p>
          <p className="tooltip-percentage">
            Percentage: <strong>{((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="pie-legend">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="legend-text">
              {entry.value}: {chartData.find(item => item.name === entry.value)?.value || 0}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>{title || 'Pet Registration Distribution'}</h3>
        </div>
        <div className="no-data">
          <p>No data available for pie chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{title || 'Pet Registration Distribution'}</h3>
        <p className="chart-subtitle">Breakdown of registration status</p>
      </div>
      
      <div className="pie-chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="pie-summary">
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Most Common Status</h4>
            <p className="highlight">
              {chartData.length > 0 
                ? chartData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name
                : 'N/A'
              }
            </p>
          </div>
          <div className="summary-card">
            <h4>Total Entries</h4>
            <p className="highlight">
              {chartData.reduce((sum, item) => sum + item.value, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;