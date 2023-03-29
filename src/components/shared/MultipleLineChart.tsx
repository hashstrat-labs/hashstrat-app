import moment from 'moment'
import { useState, useEffect } from "react"
import { Box, Button, Switch } from  "@material-ui/core"


import {
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
	ReferenceArea,
} from 'recharts'

import { ZoomOutMap }  from "@material-ui/icons"

export type TimeSeriesData = { time: number, [x: string]: number | string }

export interface ChartData {
	title: string;
	data: TimeSeriesData[];
	label1?: string,
	label2?: string,
	label3?: string,
	label4?: string,
	label5?: string,
	yAxisRange: any
	height: number,
	scale: 'linear' | 'log'
}


export const MultipleLineChart = (chartData: ChartData) => {

	const start = (chartData.data && chartData.data.length > 1) ? chartData.data[0].time : undefined
	const end = (chartData.data && chartData.data.length > 1) ? chartData.data[chartData.data.length - 1].time : undefined

	let [scale, setScale] = useState<"log" | "linear">(chartData.scale);

	let [domain, setDomain] = useState({
		left: start,
		right: end
	});

	let [zoom, setZoom] = useState<{ left: number | undefined, drag: number | undefined, right: number | undefined, } >({
		left: undefined,
		drag: undefined,
		right: undefined
	});


	let [data, setData] = useState<TimeSeriesData[]>(chartData.data);


	useEffect(() => {
		if (start !== undefined && end !== undefined) {
			setDomain({
				left: start,
				right: end
			})
			setData( chartData.data )
		}
	}, [start, end, chartData])


	// react to zoom changes and upate chart data and doamin
	useEffect(() => {
		if ( chartData && chartData.data && zoom.left !== undefined && zoom.right !== undefined ) {
			const min = Math.min(zoom.left, zoom.right)
			const max = Math.max(zoom.left, zoom.right)
			setData(chartData.data.filter(it => it.time >= min && it.time <= max ))
			setDomain({
				left: min,
				right: max,
			})
		}
	
	}, [zoom])


	const renderCustomizedLabel = (a: any) => {
		if (!data) return (
			<text x={a.x} y={a.y} textAnchor='middle' dominantBaseline="central"></text>
		)

		const record : any = data[a.index]
		const annotation =
			record['Annotation'] === 'BUY' ? '▲' : 
			record['Annotation'] === 'SELL' ? '▼' : ''

		const color = 
			record['Annotation'] === 'BUY' ? 'green' : 
			record['Annotation'] === 'SELL' ? 'red' : 'black'

		return (
			<text x={a.x} y={a.y} fill={color} textAnchor='middle' dominantBaseline="central"> {annotation}</text>
		)
	};

	const resetZoom = () => {
		setZoom({
			left: undefined,
			drag: undefined,
			right: undefined,
		})
		setDomain({
			left: start,
			right: end,
		})
	}

	const toggleScale = () => {
		setScale( (scale === 'log') ? 'linear' : 'log')
	}


	if ( data === undefined || domain.left === undefined || domain.right === undefined) {
		return (
			<div>loading...</div>
		)
	}



	return (
		<>
			<Box style={{ minHeight: 30 }}>
			
				<Box style={{ display: "flex", alignItems: "center", justifyContent: "right" }} >
					Log scale <Switch
						checked={scale === 'log'}
						onChange={toggleScale}
						name="toggleScale"
						color="primary"
					/> 
					{ domain.left !== start && domain.right !== end && 
						<Button style={{width: 30, height: 30}} onClick={resetZoom}> <ZoomOutMap /> </Button> 
					}
				</Box>
			
			</Box>

		
			<ResponsiveContainer width='100%' height={chartData.height ?? 400} >
				
				<LineChart
					margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
					// width={500}  height={300}
					data={data}

					onMouseDown={(e) => {
							if (e !== null) {
								setZoom({
									left: Number(e.activeLabel), 
									right: undefined, 
									drag: undefined,
								})
							}
						}
					}

					onMouseMove={(e) => {
							if (e !== null) {
								setZoom((oldZoom) => ({ 
									left: oldZoom.left, // Math.min(oldZoom.left!, Number(e.activeLabel)), 
									drag: Number(e.activeLabel),// Math.max(oldZoom.left!, Number(e.activeLabel)), 
									right: undefined
								}))
							}
						}
					}


					onMouseUp={(e) => {
							if (e !== null) {
								
								const min = Math.min(zoom.left!, Number(e.activeLabel))
								const max = Math.max(zoom.left!, Number(e.activeLabel))

								if ( (max - min) / 1000 < 7 * 86400) {
									setZoom(({ 
										left: undefined, 
										drag: undefined,
										right: undefined
									}))
									return
								}

								setDomain((oldDomain) => ({ 
									left: Math.min(zoom.left!, Number(e.activeLabel)), 
									right: Math.max(zoom.left!, Number(e.activeLabel))
								}))
								setZoom(({ 
									left: undefined, 
									drag: undefined,
									right: undefined
								}))
							}
						}
					}
				>

					<CartesianGrid strokeDasharray="1 1" />

					<XAxis
						dataKey='time'
						name='Time'
						domain={[domain.left, domain.right]}
						allowDataOverflow={true}
						tickFormatter={(unixTime) => moment(unixTime).format('yyyy-MM-DD')}
						type='number'
						scale="auto"
					/>

					{zoom.left && zoom.drag ? (
						<ReferenceArea
							yAxisId="right-axis"
							x1={zoom.left}
							x2={zoom.drag}
							strokeOpacity={0.3}
						/>
					) : null}

					<YAxis 
						name="Y Axis"
						type="number"
						yAxisId="right-axis"
						orientation="right"
						scale={scale} //   chartData.scale === 'log' ? 'log' : 'linear'
						domain={chartData.yAxisRange ? chartData.yAxisRange : ['auto', 'auto']}
					/>


					<YAxis 
						name="Y Axis"
						type="number"
						yAxisId="left-axis"
						orientation="left"
						scale="linear"
						domain={[0, 100]}
					/>


					<Legend verticalAlign="bottom" height={30} />
					<Tooltip
						labelFormatter={(unixTime) => moment(unixTime).format('yyyy-MM-DD')}
				
					/>

					{chartData.label1 && <Line
							type="linear"
							dataKey={chartData.label1}
							yAxisId="right-axis"
							stroke="#64b5f6"
							fill="#64b5f6"
							isAnimationActive={false}
							dot={false}
							label={renderCustomizedLabel}
						/>
					}

					{chartData.label2 &&
						<Line
							type="linear"
							dataKey={chartData.label2}
							yAxisId="right-axis"
							stroke="#fb5607"
							fill="#fb5607"
							isAnimationActive={false}
							dot={false}
						/>
					}

					{chartData.label3 &&
						<Line
							type="linear"
							dataKey={chartData.label3}
							yAxisId="right-axis"
							stroke="#98c1d9"
							fill="#98c1d9"
							isAnimationActive={false}
							dot={false}
						/>
					}

					{chartData.label4 &&
						<Line
							type="linear"
							dataKey={chartData.label4}
							yAxisId="right-axis"
							stroke="#98c1d9"
							fill="#98c1d9"
							isAnimationActive={false}
							dot={false}
						/>
					}

					{chartData.label5 &&
						<Line
							type="linear"
							dataKey={chartData.label5}
							yAxisId="left-axis"
							stroke="#bf00ff"
							fill="#98c1d9"
							isAnimationActive={false}
							dot={false}
						/>
					}

				</LineChart>
				
			</ResponsiveContainer>
		</>
	)
}


