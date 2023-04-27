import React from 'react';

interface DataItem {
  name: string;
  value: number;
}

interface StackedBarChartProps {
  data: DataItem[];
  width?: number;
  height: number;
  direction: 'horizontal' | 'vertical'
}

const colors = {
    'WBTC': '#F2A33D', 
    'WETH': '#5083EF', 
    'USDC': '#7DC37C'
};

const colorsEnd = {
    'WBTC': '#F5BD65', 
    'WETH': '#7Eb4F9', 
    'USDC': '#94D294'
};


export const StackedBarChart: React.FC<StackedBarChartProps> = ({ direction, data, width, height }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  const sorded = data.sort( (a, b) => { return b.value - a.value } )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column', 
        alignItems: 'stretch',
        width: `100%`,
        height: `${height}px`,
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
        {sorded.map((item, index) => (
            <div
            key={index}
            style={{
                flexBasis: `${(item.value / total) * 100}%`,

                backgroundImage: `linear-gradient(to right, ${colors[item.name as keyof typeof colors]}, ${colorsEnd[item.name as keyof typeof colors]})`,
                // backgroundColor: colors[item.name as keyof typeof colors],
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
            >
            <span
                style={{
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '14px',
                position: 'absolute',
                }}
            >
                {Math.round( item.value / total * 100)}%
            </span>
            </div>
        ))}

    </div>
  );
};

// export default StackedBarChart;
