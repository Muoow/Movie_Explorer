<script setup lang="ts">
import { ref } from "vue"
import { type CinemaPoiInfo } from "@/api/responsePanel.ts"

const props = defineProps<{ pois: CinemaPoiInfo[]; }>();

const activeNames = ref<string[]>([]);

const formatOpentime = (timeStr: string | undefined): string => {
  if (!timeStr) return '暂无信息';
  return timeStr.replace(/ /g, ' | ');
};

const formatAddress = (poi: CinemaPoiInfo): string => {
  let address = poi.address || '暂无详细地址';
  const locationParts = [poi.pname, poi.cityname, poi.adname];

  for (const part of locationParts) {
    if (address.includes(part)) {
      return address;
    }
  }
  return `${poi.adname}${address}`;
};
</script>

<template>
  <div class="cinema-display-container">
    <header class="cinema-header">
      附近影院
    </header>

    <el-collapse v-model="activeNames">
      <el-collapse-item
          v-for="poi in props.pois"
          :key="poi.id"
          :name="poi.id"
      >
        <template #title>
          <div class="collapse-header">
            <span class="cinema-name">{{ poi.name }}</span>
            <div class="header-tags">
              <el-tag
                  v-if="poi.business?.rating"
                  size="large"
                  type="warning"
                  class="el-tag"
              >
                {{ poi.business.rating }} / 5 ⭐
              </el-tag>
              <el-tag
                  v-if="poi.business?.cost"
                  size="large"
                  type="info"
                  class="el-tag"
              >
                ¥{{ poi.business.cost }} / 人
              </el-tag>
            </div>
          </div>
        </template>

        <el-descriptions
            :column="2"
            border
            size="small"
            class="detail-description"
        >
          <el-descriptions-item label="详细地址" :span="2">
            <span class="detail-text">{{ formatAddress(poi) }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="所属省市">
            <span class="detail-text">{{ poi.pname }} - {{ poi.cityname }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="区县商圈">
                  <span class="detail-text">
                      {{ poi.adname }}
                      <span v-if="poi.business?.business_area" class="business-area-tag">
                          ({{ poi.business.business_area }})
                      </span>
                  </span>
          </el-descriptions-item>

          <el-descriptions-item label="商家电话" :span="2">
            <span class="detail-text">{{ poi.business?.tel || '暂无信息' }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="今日营业" :span="2">
            <span class="time-detail">{{ formatOpentime(poi.business?.opentime_today) }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="完整时间" :span="2">
            <span class="time-detail">{{ poi.business?.opentime_week || '暂无信息' }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="区划编码">
            <span class="code-text">{{ poi.adcode || 'N/A' }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="POI ID">
            <span class="code-text">{{ poi.id }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.cinema-header {
  padding-top: 10px;
  padding-bottom: 10px;
  color: var(--el-text-color-primary);
  font-size: 20px;
  font-weight: bold;
}

.collapse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 10px;
}

.cinema-name {
  font-weight: bold;
  font-size: 16px;
  color: var(--el-text-color-regular);
}

.el-tag {
  font-size: 14px;
  margin: 5px;
}

.detail-description {
  margin-top: 10px;
}

.detail-text {
  font-size: 0.8rem;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.time-detail {
  font-size: 0.8rem;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.code-text {
  font-size: 0.8rem;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

</style>
