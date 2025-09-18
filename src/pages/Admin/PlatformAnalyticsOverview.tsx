import React, { useState } from 'react';
import { ChevronDown, TrendingUp, TrendingDown, User } from 'lucide-react';

const PlatformAnalyticsOverview: React.FC = () => {
    const [sortBy, setSortBy] = useState('Sort By');
    const [industry, setIndustry] = useState('Industry');
    const [thisMonth, setThisMonth] = useState('This Month');
    const [showLivesOnly, setShowLivesOnly] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState('Select Multiple Company');

    // Trending Industries Data
    const trendingData = [
        {
            id: 1,
            icon: '🏠',
            name: 'Real Estate',
            usage: 55,
            monthlyComp: 7.8,
            trend: 'up',
            status: 'Active'
        },
        {
            id: 2,
            icon: '🏛️',
            name: 'Finance',
            usage: 55,
            monthlyComp: -7.5,
            trend: 'down',
            status: 'Reviewing'
        },
        {
            id: 3,
            icon: '🌿',
            name: 'Renewable energy',
            usage: 55,
            monthlyComp: 9.6,
            trend: 'up',
            status: 'Deprecated'
        },
        {
            id: 4,
            icon: '✈️',
            name: 'Travel Agency',
            usage: 55,
            monthlyComp: 7.8,
            trend: 'up',
            status: 'Active'
        },
        {
            id: 5,
            icon: '💄',
            name: 'Beauty & wellness',
            usage: 55,
            monthlyComp: 6.5,
            trend: 'up',
            status: 'Active'
        }
    ];

    // Chart Usage Data
    const chartUsageData = [
        { name: 'Column', value: 95, color: '#8B5CF6' },
        { name: 'Doughnut Pie', value: 80, color: '#8B5CF6' },
        { name: 'Bar', value: 73, color: '#8B5CF6' },
        { name: 'Radar', value: 55, color: '#8B5CF6' },
        { name: 'Choropleth map', value: 51, color: '#8B5CF6' },
        { name: 'Area', value: 37, color: '#8B5CF6' },
        { name: 'Heat Map', value: 27, color: '#8B5CF6' }
    ];

    // Login data for area chart
    const loginData = {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
            {
                name: 'Active Days',
                data: [800, 900, 1100, 1000, 1200, 1300, 1400, 1200, 1100, 1000, 900, 800],
                color: '#3B82F6'
            },
            {
                name: 'Global Inc',
                data: [600, 700, 800, 900, 1000, 1100, 1200, 1300, 1200, 1100, 1000, 900],
                color: '#10B981'
            },
            {
                name: 'Oceanic Airlines',
                data: [400, 500, 600, 700, 800, 900, 1000, 1100, 1000, 900, 800, 700],
                color: '#F59E0B'
            }
        ]
    };

    // Bounce rate data
    const bounceRateData = [
        { month: 'Jan', engaged: 65, bounced: 35 },
        { month: 'Feb', engaged: 75, bounced: 25 },
        { month: 'Mar', engaged: 70, bounced: 30 },
        { month: 'Apr', engaged: 60, bounced: 40 },
        { month: 'May', engaged: 65, bounced: 35 },
        { month: 'Jun', engaged: 80, bounced: 20 }
    ];

    // Area Chart Component
    const AreaChart = ({ data }: { data: typeof loginData }) => {
        const maxValue = Math.max(...data.series.flatMap(s => s.data));
        const chartHeight = 300;
        const chartWidth = 600;
        const padding = { top: 20, right: 20, bottom: 40, left: 60 };
        
        const xScale = (index: number) => (index / (data.months.length - 1)) * (chartWidth - padding.left - padding.right) + padding.left;
        const yScale = (value: number) => chartHeight - padding.bottom - (value / maxValue) * (chartHeight - padding.top - padding.bottom);

        const createPath = (points: number[]) => {
            let path = `M ${xScale(0)} ${yScale(points[0])}`;
            for (let i = 1; i < points.length; i++) {
                const x = xScale(i);
                const y = yScale(points[i]);
                const prevX = xScale(i - 1);
                const prevY = yScale(points[i - 1]);
                const cpX1 = prevX + (x - prevX) / 3;
                const cpX2 = x - (x - prevX) / 3;
                path += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
            }
            return path;
        };

        const createAreaPath = (points: number[]) => {
            const linePath = createPath(points);
            const bottomY = yScale(0);
            return `${linePath} L ${xScale(points.length - 1)} ${bottomY} L ${xScale(0)} ${bottomY} Z`;
        };

        return (
            <div className="w-full">
                <div className="flex items-center space-x-4 mb-4 text-xs">
                    {data.series.map((series, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: series.color }}></div>
                            <span className="text-gray-600">{series.name}</span>
                        </div>
                    ))}
                </div>
                <div className="relative">
                    <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                        {/* Grid lines */}
                        {[0, 250, 500, 750, 1000, 1250, 1500, 1750].map((value, index) => (
                            <g key={index}>
                                <line
                                    x1={padding.left}
                                    y1={yScale(value)}
                                    x2={chartWidth - padding.right}
                                    y2={yScale(value)}
                                    stroke="#f1f5f9"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={padding.left - 10}
                                    y={yScale(value) + 4}
                                    textAnchor="end"
                                    fontSize="12"
                                    fill="#64748b"
                                >
                                    {value}
                                </text>
                            </g>
                        ))}
                        
                        {/* Area fills */}
                        {data.series.map((series, index) => (
                            <path
                                key={`area-${index}`}
                                d={createAreaPath(series.data)}
                                fill={series.color}
                                fillOpacity="0.1"
                            />
                        ))}
                        
                        {/* Lines */}
                        {data.series.map((series, index) => (
                            <path
                                key={`line-${index}`}
                                d={createPath(series.data)}
                                fill="none"
                                stroke={series.color}
                                strokeWidth="2"
                            />
                        ))}
                        
                        {/* X-axis labels */}
                        {data.months.map((month, index) => (
                            <text
                                key={index}
                                x={xScale(index)}
                                y={chartHeight - 10}
                                textAnchor="middle"
                                fontSize="12"
                                fill="#64748b"
                            >
                                {month}
                            </text>
                        ))}
                    </svg>
                </div>
            </div>
        );
    };

    // Donut Chart Component
    const DonutChart = ({ data }: { data: { labels: string[], values: number[], colors: string[] } }) => {
        const total = data.values.reduce((sum, val) => sum + val, 0);
        const size = 200;
        const strokeWidth = 30;
        const radius = (size - strokeWidth) / 2;
        const center = size / 2;
        const circumference = 2 * Math.PI * radius;
        
        let cumulativePercentage = 0;

        return (
            <div className="flex flex-col items-center">
                <div className="relative">
                    <svg width={size} height={size}>
                        {data.values.map((value, index) => {
                            const percentage = (value / total) * 100;
                            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                            const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
                            cumulativePercentage += percentage;

                            return (
                                <circle
                                    key={index}
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    fill="transparent"
                                    stroke={data.colors[index]}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    style={{ transformOrigin: `${center}px ${center}px` }}
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-lg font-semibold text-gray-900">520K</div>
                        <div className="text-xs text-gray-500">Total Rendered</div>
                    </div>
                </div>
            </div>
        );
    };

    // Bar Chart Component
    const BarChart = ({ data }: { data: typeof bounceRateData }) => {
        const chartHeight = 200;
        const chartWidth = 400;
        const padding = { top: 20, right: 20, bottom: 40, left: 40 };
        const barWidth = (chartWidth - padding.left - padding.right) / data.length / 3;

        return (
            <div className="w-full">
                <div className="flex items-center space-x-4 mb-4 text-xs">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-gray-600">Engaged</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <span className="text-gray-600">Bounced</span>
                    </div>
                </div>
                <div className="relative">
                    <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                        {/* Grid lines */}
                        {[0, 20, 40, 60, 80, 100].map((value, index) => (
                            <g key={index}>
                                <line
                                    x1={padding.left}
                                    y1={chartHeight - padding.bottom - (value / 100) * (chartHeight - padding.top - padding.bottom)}
                                    x2={chartWidth - padding.right}
                                    y2={chartHeight - padding.bottom - (value / 100) * (chartHeight - padding.top - padding.bottom)}
                                    stroke="#f1f5f9"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={padding.left - 10}
                                    y={chartHeight - padding.bottom - (value / 100) * (chartHeight - padding.top - padding.bottom) + 4}
                                    textAnchor="end"
                                    fontSize="10"
                                    fill="#64748b"
                                >
                                    {value}%
                                </text>
                            </g>
                        ))}
                        
                        {/* Bars */}
                        {data.map((item, index) => {
                            const x = padding.left + (index * (chartWidth - padding.left - padding.right)) / data.length;
                            const engagedHeight = (item.engaged / 100) * (chartHeight - padding.top - padding.bottom);
                            const bouncedHeight = (item.bounced / 100) * (chartHeight - padding.top - padding.bottom);
                            
                            return (
                                <g key={index}>
                                    {/* Engaged bar */}
                                    <rect
                                        x={x + 5}
                                        y={chartHeight - padding.bottom - engagedHeight}
                                        width={barWidth}
                                        height={engagedHeight}
                                        fill="#8B5CF6"
                                        rx="2"
                                    />
                                    {/* Bounced bar */}
                                    <rect
                                        x={x + barWidth + 10}
                                        y={chartHeight - padding.bottom - bouncedHeight}
                                        width={barWidth}
                                        height={bouncedHeight}
                                        fill="#D1D5DB"
                                        rx="2"
                                    />
                                    {/* Month label */}
                                    <text
                                        x={x + barWidth + 5}
                                        y={chartHeight - 10}
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill="#64748b"
                                    >
                                        {item.month}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Reviewing': return 'bg-yellow-100 text-yellow-800';
            case 'Deprecated': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Section - Trending Industries */}
                    <div className="col-span-6">
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Trending Industries</h2>
                                    <div className="relative">
                                        <button className="flex items-center space-x-2 px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                                            <span>{sortBy}</span>
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <th className="text-left pb-3">Employee Name</th>
                                            <th className="text-left pb-3">Usage</th>
                                            <th className="text-left pb-3">Monthly Comp.</th>
                                            <th className="text-left pb-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="space-y-3">
                                        {trendingData.map((item, index) => (
                                            <tr key={item.id} className="border-b border-gray-100">
                                                <td className="py-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                                                            {item.icon}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className="text-sm text-gray-900">{item.usage}</span>
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center space-x-1">
                                                        {item.trend === 'up' ? (
                                                            <TrendingUp className="w-3 h-3 text-green-500" />
                                                        ) : (
                                                            <TrendingDown className="w-3 h-3 text-red-500" />
                                                        )}
                                                        <span className={`text-sm ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                            {item.trend === 'up' ? '+' : ''}{item.monthlyComp}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Chart Usages */}
                    <div className="col-span-6">
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Chart Usages</h2>
                                    <div className="flex items-center space-x-2">
                                        <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                                            <span>{industry}</span>
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                        <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                                            <span>{thisMonth}</span>
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">Total usage 576k</span>
                                        <label className="flex items-center space-x-2 text-xs text-gray-600">
                                            <input
                                                type="checkbox"
                                                checked={showLivesOnly}
                                                onChange={(e) => setShowLivesOnly(e.target.checked)}
                                                className="w-3 h-3 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                            />
                                            <span>Usage Data</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {chartUsageData.map((chart, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 w-24">{chart.name}</span>
                                            <div className="flex-1 mx-3">
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div 
                                                        className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                                                        style={{ width: `${chart.value}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 w-8 text-right">{chart.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logins Over Time Chart */}
                    <div className="col-span-8">
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Logins Over Time</h2>
                                    <button className="flex items-center space-x-2 px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                                        <User className="w-4 h-4" />
                                        <span>{selectedCompany}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <AreaChart data={loginData} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Rendering Status */}
                    <div className="col-span-4 space-y-6">
                        {/* Rendering Status */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Rendering Status</h2>
                                    <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                                        <span>Sort By</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="flex items-center space-x-2 text-xs text-gray-600">
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="w-3 h-3 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                        <span>Show Live Only</span>
                                    </label>
                                </div>
                                <div className="flex justify-center mb-4">
                                    <DonutChart 
                                        data={{
                                            labels: ['Successful load', 'Partial load', 'Failed to load'],
                                            values: [14, 21, 65],
                                            colors: ['#10B981', '#F59E0B', '#EF4444']
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-gray-600">Successful load</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">338k</div>
                                            <div className="text-xs text-gray-500">65%</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <span className="text-gray-600">Partial load</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-gray-500">21%</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <span className="text-gray-600">Failed to load</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-gray-500">65%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Bounce Rate */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">User Bounce Rate</h2>
                            </div>
                            <div className="p-6">
                                <BarChart data={bounceRateData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformAnalyticsOverview;