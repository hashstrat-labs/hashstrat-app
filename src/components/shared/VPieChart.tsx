
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

        border: `1px solid ${theme.palette.type === 'light' ?  theme.palette.grey[400] : "white" }`,
        borderRadius: 12,
        paddingTop: 10
    }
  }))
  
  const categories = chartData.data.map( it => it.name )
  const series = chartData.data.map( it => it.value )

 
  const colorMap = {
    'USDC': '#1398DA',
    'WBTC': '#FFA10F',
    'WETH': '#A2B5BE',
  }
  const colorArray =  ['#EC7063', '#F4D03F', '#1ABC9C', '#2980B9', '#AF7AC5', '#9FE2BF', '#0B5345', '#DE3163'] // #40E0D0
  const colors = categories.map( (c, idx) => { return colorMap[c as keyof typeof colorMap ] ?? colorArray[ idx % colorArray.length ] } )

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
    },

    colors: colors,

    // fill: {
    //   colors: ['#F44336', '#E91E63', '#9C27B0']
    // }

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

