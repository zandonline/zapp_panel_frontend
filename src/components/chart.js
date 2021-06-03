import React from "react";

import {
  BarChart, 
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import { Card, CardBody } from "reactstrap";

export default function Panel({ chartData, title,datakey }) {
 

  return (
    <div className='ltr'>
      <Card style={{ margin: 8 }}>
        <CardBody>
          <ResponsiveContainer width="100%"
              height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 0, left: 0, bottom: 20}}
            >
              <XAxis
                dataKey="name"
                tick={{ color:"#fff" }}
                hide={true}
                // padding={{ left: 0, right: 0 }}
              />
              <YAxis
                tick={{ stroke: "#2c3e50", strokeWidth: 1 }}
                padding={{ top: 0, bottom: 0 }}
              />

              <CartesianGrid strokeDasharray="7 7" />
              <Tooltip />
              <Legend />

              <Bar
                type="monotone"
                name={title}
                dataKey={datakey}              
                fill="#8884d8"
                // label={{ fill: "black", fontSize: 20 }}
              />
              
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
}
