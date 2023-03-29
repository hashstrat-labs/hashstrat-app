
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { makeStyles, Box, Typography } from "@material-ui/core"

import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";


export type ChartItem = {
    x: string;
    y: number;
}

export type TreeChartSeries = {
    name: string;
    data: ChartItem[];
}

export type ChartData = {
    title: string;
    data?: TreeChartSeries[];
    width?: number
    height?: number
}


export const TreeChart = (chartData: ChartData) => {

    const useStyle = makeStyles(theme => ({
        chart: {
            margin: "auto",
            minHeight: 300,
        }
    }))

    const series = chartData.data
    const categories = series?.map(it => it.name)
    const options: ApexOptions = {

        labels: categories,
        legend: {
            show: true,
            position: 'bottom',
            labels: {
                useSeriesColors: true
            },
        },
        chart: {
            toolbar: {
                show: false,
            },
            animations: {
                enabled: false,
            }
        },

        // responsive: [{
        //   breakpoint: 800,
        //   options: {
        //     // chart: {
        //     //   width: 320
        //     // },
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
                type="treemap"
                // width={chartData.width?? "100%"}
                height={chartData.height ?? 300}

                tooltip={
                    {
                        enabled: true,
                        y: {
                            formatter: function(value : number, {  }) {
                                return `$ aaaa ${value}`
                            }
                        }
                    }
                }
            />

        </Box>
    )
}

