import moment from 'moment'

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'


export interface TimeSeriesData {
    value: number;
    value2: number;
    time: number;
}

export interface ChartData {
    title: string;
    data: TimeSeriesData[];
    label1: string,
    label2: string,
    yAxisRange: any
    scale: 'linear' | 'log'
    width?: number,
    height?: number
}





export const TimeSeriesDualLineChart = ( chartData  : ChartData ) => {

  const start = (chartData.data && chartData.data.length > 1) ? chartData.data[0].time : (new Date()).getTime() - 604800 * 1000
  const end =   (chartData.data && chartData.data.length > 1) ? chartData.data[chartData.data.length-1].time : (new Date()).getTime()


  return (
  <ResponsiveContainer width = '100%' height = { chartData.height ?? 300 } >
 
    <LineChart 
          margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          width={chartData.width ?? 500} height={chartData.height ?? 300}
          data={chartData.data}
    >
      <CartesianGrid strokeDasharray="1 1" />

      <XAxis
        dataKey = 'time'
        domain = {[start, end]}
        name = 'Time'
        tickFormatter = {(unixTime) => moment(unixTime).format('yyyy-MM-DD')}
        type = 'number'
      />

      <YAxis
        name = "Y1 Axis" 
        type="number" 
        yAxisId="right-axis" 
        orientation="right" 
        scale={chartData.scale}
        domain={['auto', 'auto'] } 
      />

      <YAxis
        name = "Y2 Axis" 
        type="number" 
        yAxisId="left-axis" 
        orientation="left" 
        scale={chartData.scale}
        domain={['auto', 'auto'] } 
      />

      <Legend verticalAlign="bottom" height={30}/>
      <Tooltip 
        labelFormatter={(unixTime) => moment(unixTime).format('yyyy-MM-DD')}
      />

      <Line
        type="linear"
        dataKey={chartData.label1}
        yAxisId="right-axis"
        stroke="#64b5f6"
        fill="#64b5f6"
        isAnimationActive={false}
        dot={false}
      />

    <Line
        type="linear"
        dataKey={chartData.label2}
        yAxisId="left-axis"
        stroke="#82ca9d"
        fill="#82ca9d"
        isAnimationActive={false}
        dot={false}
      />

    </LineChart>
  </ResponsiveContainer>
)}

