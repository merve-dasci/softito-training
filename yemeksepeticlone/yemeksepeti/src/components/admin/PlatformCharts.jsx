import React, { useMemo, useState } from 'react';
import { ShoppingBag, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export const PlatformCharts = React.memo(({ orders = [] }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // 1. ORDER STATUS DISTRIBUTIONS
  const statusStats = useMemo(() => {
    const counts = orders.reduce((acc, order) => {
      const status = order.status || 'Hazırlanıyor';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, { 'Hazırlanıyor': 0, 'Yolda': 0, 'Teslim edildi': 0, 'İptal edildi': 0 });

    const total = orders.length || 1;
    
    return [
      {
        name: 'Hazırlanıyor',
        count: counts['Hazırlanıyor'],
        percent: Math.round((counts['Hazırlanıyor'] / total) * 100),
        color: 'from-amber-500 to-orange-600',
        textColor: 'text-amber-500',
        borderColor: 'border-amber-500/20',
        bgColor: 'bg-amber-500/10'
      },
      {
        name: 'Yolda',
        count: counts['Yolda'],
        percent: Math.round((counts['Yolda'] / total) * 100),
        color: 'from-blue-500 to-indigo-600',
        textColor: 'text-blue-400',
        borderColor: 'border-blue-500/20',
        bgColor: 'bg-blue-500/10'
      },
      {
        name: 'Teslim edildi',
        count: counts['Teslim edildi'],
        percent: Math.round((counts['Teslim edildi'] / total) * 100),
        color: 'from-emerald-500 to-teal-600',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/20',
        bgColor: 'bg-emerald-500/10'
      },
      {
        name: 'İptal edildi',
        count: counts['İptal edildi'],
        percent: Math.round((counts['İptal edildi'] / total) * 100),
        color: 'from-red-500 to-rose-600',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/20',
        bgColor: 'bg-red-500/10'
      }
    ];
  }, [orders]);

  // 2. MONTHLY DATA & TRENDS (Line/Area Chart)
  const monthlyData = useMemo(() => {
    const shortMonths = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    
    const data = shortMonths.map((name, idx) => ({
      name,
      revenue: 0,
      ordersCount: 0
    }));

    orders.forEach((order) => {
      if (!order.date) return;
      const parts = order.date.split('-');
      if (parts.length >= 2) {
        const monthIndex = parseInt(parts[1], 10) - 1; // 0-11
        if (monthIndex >= 0 && monthIndex < 12) {
          data[monthIndex].ordersCount += 1;
          data[monthIndex].revenue += parseFloat(order.totalPrice) || 0;
        }
      }
    });

    return data;
  }, [orders]);

  // SVG Chart Geometry Constants
  const svgWidth = 550;
  const svgHeight = 220;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const chartParams = useMemo(() => {
    const maxVal = Math.max(...monthlyData.map(d => d.revenue), 1000);
    // Y-axis tick values (4 steps)
    const yTicks = [
      Math.round(maxVal),
      Math.round(maxVal * 0.66),
      Math.round(maxVal * 0.33),
      0
    ];

    // Generate coordinates for the SVG path
    const points = monthlyData.map((d, index) => {
      const x = paddingLeft + (index * (chartWidth / 11));
      const y = paddingTop + chartHeight - ((d.revenue / maxVal) * chartHeight);
      return { x, y, data: d, index };
    });

    // Create Path String
    let linePath = '';
    let areaPath = '';

    if (points.length > 0) {
      linePath = `M ${points[0].x} ${points[0].y}`;
      points.slice(1).forEach(p => {
        linePath += ` L ${p.x} ${p.y}`;
      });

      // Area path wraps back to X axis floor
      areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;
    }

    return { yTicks, points, linePath, areaPath, maxVal };
  }, [monthlyData, chartWidth, chartHeight]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
      
      {/* 1. Order Status distribution bar system */}
      <div className="bg-[#17171C] border border-[#2e303a] rounded-2xl p-6 shadow-md flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-white flex items-center space-x-2 border-b border-[#2e303a]/50 pb-3 mb-4">
            <ShoppingBag size={18} className="text-[#B83246]" />
            <span>Sipariş Durum Dağılımı</span>
          </h4>
          <p className="text-gray-400 text-xs mb-6">Siparişlerin durumlarına göre anlık dağılım oranları ve toplam sayıları.</p>
        </div>

        <div className="space-y-4">
          {statusStats.map((status) => (
            <div key={status.name} className="space-y-1.5 text-left">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span className="flex items-center space-x-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${status.color}`}></span>
                  <span>{status.name}</span>
                </span>
                <span className="text-gray-400">
                  {status.count} Sipariş ({status.percent}%)
                </span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="w-full bg-[#0B0B0F] h-2.5 rounded-full overflow-hidden border border-[#2e303a]/30">
                <div
                  className={`bg-gradient-to-r ${status.color} h-full rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${status.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 pt-6 mt-4 border-t border-[#2e303a]/50">
          {statusStats.map((status) => (
            <div key={status.name} className={`p-2.5 rounded-xl border ${status.borderColor} ${status.bgColor} text-center space-y-1`}>
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{status.name.split(' ')[0]}</span>
              <span className={`text-base font-black ${status.textColor}`}>{status.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Monthly Revenue line area trend chart */}
      <div className="bg-[#17171C] border border-[#2e303a] rounded-2xl p-6 shadow-md flex flex-col justify-between text-left">
        <div>
          <h4 className="text-base font-bold text-white flex items-center space-x-2 border-b border-[#2e303a]/50 pb-3 mb-4">
            <TrendingUp size={18} className="text-[#B83246]" />
            <span>Aylık Hasılat & Sipariş Trendi</span>
          </h4>
          <p className="text-gray-400 text-xs mb-4">Aylara göre toplam satış gelirleri (TL) ve platform yoğunluğu.</p>
        </div>

        {/* SVG Responsive Graph */}
        <div className="relative w-full flex justify-center">
          <svg
            width="100%"
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="overflow-visible"
          >
            {/* Background Grid Lines */}
            {chartParams.yTicks.map((tick, idx) => {
              const y = paddingTop + (idx * (chartHeight / 3));
              return (
                <g key={idx} className="opacity-20">
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="#888888"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  {/* Left Label */}
                  <text
                    x={paddingLeft - 8}
                    y={y + 4}
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="end"
                  >
                    {tick} TL
                  </text>
                </g>
              );
            })}

            {/* Area Path with beautiful gradient fill */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B83246" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#7A1E2C" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {chartParams.areaPath && (
              <path d={chartParams.areaPath} fill="url(#chartGradient)" className="animate-fadeIn" />
            )}

            {/* Main Trend Line */}
            {chartParams.linePath && (
              <path
                d={chartParams.linePath}
                fill="none"
                stroke="#B83246"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-fadeIn"
              />
            )}

            {/* Interactive Data dots */}
            {chartParams.points.map((p) => (
              <g key={p.index}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint?.index === p.index ? '6.5' : '4.5'}
                  fill={hoveredPoint?.index === p.index ? '#FFFFFF' : '#B83246'}
                  stroke="#17171C"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                
                {/* Horizontal X axis label */}
                <text
                  x={p.x}
                  y={svgHeight - paddingBottom + 18}
                  fill={hoveredPoint?.index === p.index ? '#FFFFFF' : '#888888'}
                  fontSize="9.5"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {p.data.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Dynamic Tooltip overlay */}
          {hoveredPoint && (
            <div
              className="absolute bg-[#0B0B0F]/95 border border-[#B83246] p-3 rounded-xl shadow-2xl text-[10px] space-y-1 animate-fadeIn pointer-events-none transition-all duration-150"
              style={{
                left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                top: `${(hoveredPoint.y / svgHeight) * 100 - 32}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="font-extrabold text-[#B83246] border-b border-[#2e303a] pb-1 uppercase flex items-center space-x-1">
                <Calendar size={10} />
                <span>{hoveredPoint.data.name} Raporu</span>
              </div>
              <div className="text-white pt-1">
                Gelir: <span className="font-bold text-emerald-400">{hoveredPoint.data.revenue} TL</span>
              </div>
              <div className="text-gray-400">
                Sipariş: <span className="font-bold text-white">{hoveredPoint.data.ordersCount} Adet</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Short Summary stats indicator */}
        <div className="flex items-center space-x-2 bg-[#0B0B0F] border border-[#2e303a] p-3 rounded-xl text-xs mt-2">
          <TrendingUp size={14} className="text-emerald-400" />
          <span className="text-gray-400">
            En yüksek hasılatlı ay ve yoğunluk durumları grafik üzerinde noktaların üzerine gelinerek görüntülenebilir.
          </span>
        </div>
      </div>

    </div>
  );
});

PlatformCharts.displayName = 'PlatformCharts';
