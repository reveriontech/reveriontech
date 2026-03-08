import { ResponsiveLine } from '@nivo/line';

export interface AnalyticsTabProps {
    totalTasks: number;
    totalCompleted: number;
    lineChartData: { id: string; data: { x: string; y: number }[] }[];
}

export function AnalyticsTab({
    totalTasks,
    totalCompleted,
    lineChartData,
}: AnalyticsTabProps) {
    return (
        <div className="dashboard__content">
            <div className="dashboard__kpi-grid">
                <div className="dashboard__kpi">
                    <span className="dashboard__kpi-value">{totalTasks}</span>
                    <span className="dashboard__kpi-label">Total Tasks</span>
                </div>
                <div className="dashboard__kpi">
                    <span className="dashboard__kpi-value">{totalCompleted}</span>
                    <span className="dashboard__kpi-label">Completed</span>
                </div>
                <div className="dashboard__kpi">
                    <span className="dashboard__kpi-value">
                        {totalTasks ? Math.round((totalCompleted / totalTasks) * 100) : 0}%
                    </span>
                    <span className="dashboard__kpi-label">Completion Rate</span>
                </div>
            </div>
            <div className="dashboard__analytics">
                <h3 className="dashboard__section-title">Monthly Overview</h3>
                <div className="dashboard__chart-line">
                    <ResponsiveLine
                        data={lineChartData}
                        margin={{ top: 20, right: 20, bottom: 70, left: 50 }}
                        xScale={{ type: 'point' }}
                        yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false }}
                        curve="monotoneX"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 0,
                            tickPadding: 10,
                            tickRotation: 0,
                            legendOffset: 36,
                        }}
                        axisLeft={{
                            tickSize: 0,
                            tickPadding: 10,
                            tickRotation: 0,
                            legendOffset: -40,
                        }}
                        colors={['var(--color-border-hover)', 'var(--color-accent)']}
                        lineWidth={2}
                        pointSize={8}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabelYOffset={-12}
                        enableArea={true}
                        areaOpacity={0.15}
                        useMesh={true}
                        legends={[
                            {
                                anchor: 'bottom',
                                direction: 'row',
                                justify: false,
                                translateX: 0,
                                translateY: 48,
                                itemsSpacing: 0,
                                itemDirection: 'left-to-right',
                                itemWidth: 100,
                                itemHeight: 20,
                                itemOpacity: 1,
                                symbolSize: 10,
                                symbolShape: 'circle',
                            },
                        ]}
                        theme={{
                            text: { fill: 'var(--color-text-muted)', fontSize: 12 },
                            axis: { ticks: { text: { fill: 'var(--color-text-muted)' } } },
                            grid: { line: { stroke: 'var(--color-border)', strokeWidth: 1 } },
                            legends: { text: { fill: 'var(--color-text-muted)' } },
                            crosshair: { line: { stroke: 'var(--color-accent)' } },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
