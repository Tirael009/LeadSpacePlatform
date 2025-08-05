import React, { useEffect, useRef } from 'react';
import styles from './AnalyticsChart.module.scss';
import Chart from 'chart.js/auto';
import type { 
  ChartType, 
  ChartOptions, 
  ChartDataset, 
  TooltipItem,
  DefaultDataPoint
} from 'chart.js';

interface ExtendedChartMeta {
  total: number;
}

interface AnalyticsChartProps {
  data: number[];
  labels?: string[];
  type: ChartType;
  title?: string;
  secondDataSet?: number[];
  colors?: string[];
  height?: number;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ 
  data, 
  labels, 
  type,
  title,
  secondDataSet,
  colors = ['#00F5FF', '#9D00FF', '#26DE81', '#FED330', '#FF4757'],
  height = 300
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<ChartType, DefaultDataPoint<ChartType>, string> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Очистка предыдущего экземпляра
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const datasets: ChartDataset<ChartType, DefaultDataPoint<ChartType>>[] = [];
    
    switch (type) {
      case 'bar':
        datasets.push({
          label: 'Основные данные',
          data,
          backgroundColor: colors,
          borderColor: colors.map(c => `${c}80`),
          borderWidth: 1,
          borderRadius: 4,
        });
        break;
        
      case 'line':
        datasets.push({
          label: 'Основные данные',
          data,
          borderColor: colors[0],
          backgroundColor: `${colors[0]}20`,
          tension: 0.3,
          fill: true,
        });
        
        if (secondDataSet) {
          datasets.push({
            label: 'Дополнительные данные',
            data: secondDataSet,
            borderColor: colors[1],
            backgroundColor: `${colors[1]}20`,
            tension: 0.3,
            fill: true,
          });
        }
        break;
        
      case 'doughnut':
      case 'pie':
        datasets.push({
          data,
          backgroundColor: colors,
          borderColor: colors.map(c => `${c}80`),
          borderWidth: 1,
        });
        break;
    }

    const options: ChartOptions<ChartType> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: !!title,
          text: title,
          color: '#E2E8F0',
          font: {
            size: 14
          }
        }
      }
    };

    // Дополнительные настройки для разных типов графиков
    if (type === 'bar') {
      options.plugins = {
        ...options.plugins,
        legend: { display: false }
      };
      options.scales = {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: '#A0AEC0' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#A0AEC0' }
        }
      };
    } else if (type === 'line') {
      options.plugins = {
        ...options.plugins,
        legend: {
          labels: { color: '#E2E8F0' }
        }
      };
      options.scales = {
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: '#A0AEC0' }
        },
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: '#A0AEC0' }
        }
      };
    } else if (type === 'doughnut' || type === 'pie') {
      options.plugins = {
        ...options.plugins,
        legend: {
          position: 'right',
          labels: {
            color: '#E2E8F0',
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<'doughnut' | 'pie'>) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              const meta = context.chart.getDatasetMeta(0) as ExtendedChartMeta;
              const total = meta.total;
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      };
    }

    chartRef.current = new Chart(ctx, {
      type,
      data: {
        labels: labels || data.map((_, i) => `Пункт ${i + 1}`),
        datasets
      },
      options
    });
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data, labels, type, title, secondDataSet, colors, height]);

  return (
    <div className={styles.chartContainer} style={{ height: `${height}px` }}>
      <div className={styles.chartWrapper}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default React.memo(AnalyticsChart);