
import moment from 'moment'

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
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
    label2: string
}


export const TimeSeriesAreaChart = ( chartData  : ChartData ) => {
  
  const start = (chartData.data && chartData.data.length > 1) ? chartData.data[0].time : (new Date()).getTime() - 604800 * 1000
  const end =   (chartData.data && chartData.data.length > 1) ? chartData.data[chartData.data.length-1].time : (new Date()).getTime()

  return (
  <ResponsiveContainer width = '100%' height = {300} >
    <AreaChart 
          margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          width={500}  height={300}
          data={chartData.data}
    >
      <XAxis
        dataKey = 'time'
        domain = {[start, end]}
        name = 'Time'
        tickFormatter = {(unixTime) => moment(unixTime).format('yyyy-MM-DD')}
        type = 'number'
      />

      <YAxis name="Asset 1" scale="auto" id="asset1" orientation='right' />
      <YAxis name="Asset 2" scale="auto" id="asset2" orientation='right' />

      <Legend verticalAlign="bottom" height={30}/>

      <CartesianGrid strokeDasharray="1 1" />
      <Tooltip labelFormatter={(unixTime) => moment(unixTime).format('yyyy-MM-DD')} />

      <Area
        type="linear"
        dataKey={chartData.label1}
        stackId="1"
        stroke="#64b5f6"
        fill="#64b5f6"
        isAnimationActive={false}
      />

    <Area
        type="linear"
        dataKey={chartData.label2}
        stackId="1"
        stroke="#82ca9d"
        fill="#82ca9d"
        isAnimationActive={false}
      />

    </AreaChart>
  </ResponsiveContainer>
)}

