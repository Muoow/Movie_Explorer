<script setup lang="ts">
import {ref, onMounted} from "vue";
import AMapLoader from '@amap/amap-jsapi-loader'
import WeatherForecast from "@/components/WeatherForecast.vue";
import CinemaInfo from "@/components/CinemaInfo.vue";
import { fetchWeatherInfo } from "@/api/getWeatherInfo.ts";
import { fetchCinemaInfo } from "@/api/getCinemaInfo.ts";
import { type WeatherForecastInfo, type CinemaPoiInfo } from "@/api/responsePanel";

const MY_POS = ref<[number, number]>([121.214160, 31.286012]);

// 动态地图
let AMap: any = null
let map : any = null

// 天气数据和电影院数据
const weatherData = ref<{ forecasts: WeatherForecastInfo[]; }>()
const cinemaData = ref<{ pois: CinemaPoiInfo[]; }>()

// 当前选中的电影院
const currCinema = ref<number[]>([])
let currentDriving: any = null

onMounted(async () => {
  // 加载高德地图
  (window as any)._AMapSecurityConfig = {
    securityJsCode: import.meta.env.VITE_APP_SECURITY_KEY,
  }
  AMapLoader
      .load({
        key: import.meta.env.VITE_APP_AMAP_KEY,
        version: "2.0",
        plugins: [
          'AMap.ToolBar',
          'AMap.Scale',
          'AMap.Driving',
          'AMap.Geolocation'
        ],
      })
      .then(mapItem => {
        AMap = mapItem
        map = new AMap.Map('map-container', {
          center: [121.214160,31.286012],
          zoom: 12,
        })
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())

        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 开启高精度定位
          timeout: 10000,           // 超时时间
          position: "RB",           // 定位按钮位置（右下）
          showCircle: true,         // 显示精度圆
          showMarker: true,         // 显示定位点
          panToLocation: true,      // 定位成功后移动地图
        })

        map.addControl(geolocation)
        // 获取用户位置
        geolocation.getCurrentPosition((status: string, result: any) => {
          if (status === "complete") {
            const lng = result.position.lng
            const lat = result.position.lat
            MY_POS.value = [lng, lat]

            console.log("用户当前位置：", MY_POS.value)
            map.setCenter(MY_POS.value)
          } else {
            console.warn("定位失败：", result)
          }
        })
      })
      .catch(e => {
        console.log(e)
      })

  // 获取天气信息
  const result = await fetchWeatherInfo()
  weatherData.value = result

  // 获取影院信息
  const response = await fetchCinemaInfo(MY_POS.value[0].toString(), MY_POS.value[1].toString())
  cinemaData.value = response

  cinemaData.value?.pois.forEach((cinema) => {
    if (!cinema.location) return;

    const [lng, lat] = cinema.location.split(',').map(Number);
    if (isNaN(lng) || isNaN(lat)) return;

    const marker = new AMap.Marker({
      position: new AMap.LngLat(lng, lat),
      title: cinema.name,
    });

    const label = new AMap.Text({
      text: `🎬 ${cinema.name}`,
      position: new AMap.LngLat(lng, lat),
      style: {
        padding: "2px 6px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        fontSize: "16px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        color: "#000000",
        whiteSpace: "nowrap",
      },
      offset: new AMap.Pixel(-80, -40),
    });

    marker.on("click", () => {
      currCinema.value[0]=lng
      currCinema.value[1]=lat
      fetchDirectionsToCinema()
    });

    map.add([marker, label]);
  })
})

// 绘制地图
function fetchDirectionsToCinema() {
  if (!AMap || !map) return;

  map.plugin("AMap.Driving", () => {
    if (currentDriving) {
      currentDriving.clear();
      currentDriving = null;
    }

    currentDriving = new AMap.Driving({
      map: map,
      policy: AMap.DrivingPolicy.LEAST_TIME,
      showTraffic: false,
    });

    const origin = new AMap.LngLat(MY_POS.value[0], MY_POS.value[1]);
    const destination = new AMap.LngLat(currCinema.value[0], currCinema.value[1]);

    currentDriving.search(origin, destination, (status: string, result: any) => {
      if (status === "complete") {
        console.log("驾车路线绘制完成");
      } else {
        console.warn("获取驾车数据失败:", result);
      }
    })
  })
}

</script>

<template>
<div class="container">
  <div class="map-weather">
    <div id="map-container" />
    <div class="weather-container">
      <WeatherForecast
          v-if ="weatherData!=undefined && weatherData.forecasts.length > 0"
          :forecasts="weatherData.forecasts[0]"
      />
    </div>
  </div>
  <div class="cinema-container">
    <CinemaInfo
        v-if ="cinemaData!=undefined && cinemaData.pois.length > 0"
        :pois="cinemaData.pois"
    />
  </div>
</div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.map-weather {
  display: flex;
  flex-direction: column;
  width: 62%;
  height: 100vh;
  position: fixed;
}

#map-container {
  flex: 2;
  margin: 10px;
  border-radius: 10px;
  min-height: 500px;
}

.weather-container {
  flex: 1;
  padding: 10px;
}

.cinema-container {
  margin-left: 68%;
  width: 30%;
  padding: 10px 20px;
}

</style>
