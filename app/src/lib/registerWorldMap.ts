/**
 * Registers the bundled low-resolution world GeoJSON with ECharts.
 * Both the home-page snapshot map and the map heatmap use the same name.
 */
import * as echarts from 'echarts';
import worldLow from '@amcharts/amcharts5-geodata/worldLow';

if (!echarts.getMap('world')) {
  echarts.registerMap('world', worldLow as unknown as Parameters<typeof echarts.registerMap>[1]);
}
