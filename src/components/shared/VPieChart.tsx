
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { makeStyles, Box, Typography } from  "@material-ui/core"

import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";


export type PieChartsData = {
    name: string;
    value: number;
}

export type ChartData = {
    title: string;
    data: PieChartsData[];
    width?: number
    height?: number
    includePercent?: boolean
}


export const VPieChart = ( chartData : ChartData ) => {

  const useStyle = makeStyles( theme => ({
    chart: {
        margin: "auto",
        minWidth: chartData.width ?? 240,
        minHeight: 250, // chartData.height ?? 240,

        border: `1px solid ${theme.palette.type === 'light' ?  theme.palette.grey[500] : "white" }`,
        paddingTop: 10
    }
  }))
  
  const categories = chartData.data.map( it => it.name )
  const series = chartData.data.map( it => it.value )

  const options: ApexOptions = {
  
    labels: categories,
    legend: {
      position: 'bottom',
      labels: {
        useSeriesColors: true
      },
    },

    chart: {
      animations: {
          enabled: false,
      }
  }

    // responsive: [{
    //   breakpoint: 480,
    //   options: {
    //     chart: {
    //       width: 200
    //     },
    //     legend: {
    //       position: 'bottom'
    //     }
    //   }
    // }]
  };
  

  const classes = useStyle()

  return (
      <Box className={classes.chart}>
          <Typography align='center' variant='body1'> {chartData.title} </Typography>

          <ReactApexChart 
              options={options}
              series={series} 
              type="pie" 
              width={chartData.width?? 250}
              height={chartData.height?? 250}
          />

      </Box>
    )
  }

