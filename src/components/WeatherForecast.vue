<script setup lang="ts">
import { computed } from 'vue'
import TempChart from "@/components/TempChart.vue"
import { type WeatherForecastInfo, type RawCastInfo } from "@/api/responsePanel.ts"

// 父组件传参
const props = defineProps<{ forecasts: WeatherForecastInfo }>()

// 数字对应的星期
const weekMap: Record<string, string> = {
  '1': '周一',
  '2': '周二',
  '3': '周三',
  '4': '周四',
  '5': '周五',
  '6': '周六',
  '7': '周日',
};

// 天气对应的Icon
const weatherIcons: Record<string, string> = {
  "晴":  "☀️",
  "多云": "☁️",
  "阴": "☁️",
  "阵雨": "🌧️",
  "雷阵雨": "⛈️",
  "小雨": "🌧️",
  "中雨": "🌧️",
  "大雨": "🌧️",
  "暴雨": "🌧️",
  "雨夹雪": "🌨️",
  "小雪": "❄️",
  "中雪": "❄️",
  "大雪": "❄️",
  "暴雪": "❄️",
  "风": "🌬️",
  "霾": "😷",
}
const defaultIcon = '❓'

const dailyForecasts = computed(() => {
  return props.forecasts.casts.map(cast => {
    const dayWeather = (cast.dayweather ?? '').trim()
    const nightWeather = (cast.nightweather ?? '').trim()

    return {
      date: cast.date ?? '',
      week: weekMap[cast.week ?? ''] || '',
      day: {
        weather: dayWeather,
        temp: cast.daytemp ?? '0',
        wind: cast.daywind ?? '',
        power: cast.daypower ?? '',
        icon: weatherIcons[dayWeather] ?? defaultIcon,
      },
      night: {
        weather: nightWeather,
        temp: cast.nighttemp ?? '0',
        wind: cast.nightwind ?? '',
        power: cast.nightpower ?? '',
        icon: weatherIcons[nightWeather] ?? defaultIcon,
      }
    }
  })
})

// 传入图表的变量
const chartData = computed(() => {
  if (!props.forecasts || !props.forecasts.casts) {
    return { dates: [] as string[], dayTemps: [] as number[], nightTemps: [] as number[] }
  }

  return {
    dates: dailyForecasts.value.map(d => d.date.slice(5)),
    dayTemps: dailyForecasts.value.map(d => parseFloat(d.day.temp) || 0),
    nightTemps: dailyForecasts.value.map(d => parseFloat(d.night.temp) || 0),
  }
})
</script>

<template>
  <el-card class="weather-forecast-container">
    <template #header>
      <div class="time-part">
        <div v-for="day in dailyForecasts" :key="day.date" class="forecast-item">
          <div class="date">{{ day.date }} {{ day.week }}</div>
        </div>
      </div>
    </template>

    <div class="day-part">
      <div v-for="day in dailyForecasts" :key="day.date" class="forecast-item">
        <div class="weather-icon">{{ day.day.icon }}</div>
        <div class="weather-text">{{ day.day.weather }}  {{ day.day.temp }}℃</div>
        <div class="wind-info">
          {{ day.day.wind }} 风 | {{ day.day.power }} 级
        </div>
      </div>
    </div>

    <TempChart class="weather-chart"
                      :dates="chartData.dates"
                      :dayTemps="chartData.dayTemps"
                      :nightTemps="chartData.nightTemps"
    />

    <div class="night-part">
      <div v-for="day in dailyForecasts" :key="day.date" class="forecast-item">
        <div class="weather-icon">{{ day.night.icon }}</div>
        <div class="weather-text">{{ day.night.weather }}  {{ day.night.temp }}℃</div>
        <div class="wind-info">
          {{ day.night.wind }}风 | {{ day.night.power }}级
        </div>
      </div>
    </div>

    <template #footer>
      <div style="text-align: center; display: flex; color: var(--el-text-color);">
        <span style="flex: 1"/>
        <div class="city-info">当前区域：{{ props.forecasts.province }} {{ props.forecasts.city }}</div>
        <div class="city-info">更新时间：{{ props.forecasts.reporttime }}</div>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.weather-forecast-container {
  display: flex;
  flex-direction: column;
  padding: 0 5px
}

.city-info {
  margin: 0 16px;
  font-size: 16px;
  font-weight: bold;
}

.forecast-item {
  display: flex;
  flex: 1;
  align-items: center;
  text-align: center;
  justify-content: center;
}

.date {
  font-size: calc(12px + 0.5vw);
  font-weight: bold;
}

.time-part, .day-part, .night-part {
  display: flex;
  align-items: center;
  margin: 0;
}

.time-part {
  color: var(--el-text-color);
}

.day-part {
  color: #F48C06;
}

.night-part {
  color: #0077B6;
}

.weather-icon {
  font-size: 28px;
}

.weather-text {
  font-size: calc(10px + 0.5vw);
  font-weight: bold;
}

.wind-info {
  font-size: calc(6px + 0.5vw);
  font-weight: 500;
  margin-left: 10px;
  color: var(--el-text-color-secondary);
  text-align: center;
}

.weather-chart {
  margin-top: 10px;
}
</style>
