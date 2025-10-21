<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  dates: {
    type: Array as () => string[],
    required: true,
  },
  dayTemps: {
    type: Array as () => number[],
    required: true,
  },
  nightTemps: {
    type: Array as () => number[],
    required: true,
  },
});

const chartRef = ref<HTMLDivElement>();
let myChart: echarts.ECharts | null = null;

watchEffect((onInvalidate) => {
  if (!chartRef.value || props.dates.length === 0) return;

  if (!myChart) {
    myChart = echarts.init(chartRef.value);
  }

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    formatter: function (params: any) {
      let result = params[0].name + '<br/>';
      params.forEach((item: any) => {
        result += `${item.seriesName}: ${item.value}°C<br/>`;
      });
      return result;
    },
    grid: {
      top: '2%',
      left: '0%',
      right: '0%',
      bottom: '0%',
    },
    xAxis: {
      type: 'category',
      data: props.dates,
      axisLabel: {
        show: false,
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: false,
      }
    },
    series: [
      {
        name: '白天温度',
        type: 'line',
        data: props.dayTemps,
        smooth: false,
        lineStyle: {
          color: '#F48C06',
        },
        itemStyle: {
          color: '#F48C06',
        }
      },
      {
        name: '夜晚温度',
        type: 'line',
        data: props.nightTemps,
        smooth: false,
        lineStyle: {
          color: '#0077B6',
        },
        itemStyle: {
          color: '#0077B6',
        }
      },
    ],
  };

  myChart.setOption(option);

  const resizeHandler = () => {
    myChart?.resize();
  };
  window.addEventListener('resize', resizeHandler);

  onInvalidate(() => {
    window.removeEventListener('resize', resizeHandler);
    myChart?.dispose();
    myChart = null;
  });
});
</script>

<template>
  <div ref="chartRef" class="echarts-container"></div>
</template>

<style scoped>
.echarts-container {
  width: 100%;
  min-height: 200px;
}
</style>