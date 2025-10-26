<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { MovieGenresInfo, MovieInfo } from "@/api/responsePanel.ts";
import { Search, VideoCamera } from "@element-plus/icons-vue"
import { fetchMovieGenresInfo, fetchMoviesInfoByKeyword } from "@/api/getMovieInfo.ts"
import MovieDetail from "@/components/MovieDetail.vue";

// 筛选条件
const keyword = ref<string>('')
const region = ref<string>('')
const year = ref<string>('')
const page = ref<number>(1)

// 年份
const years = ref<string[]>([])

// 电影信息
const moviesInfo = ref<{results: MovieInfo[]; pages: number}>()
const genresInfo = ref<MovieGenresInfo>()
const loading = ref<boolean>(false)

// 选中的电影
const selectedMovie = ref<MovieInfo>()
const showDetail = ref<boolean>(false)

function handleMovieClick(movie: any) {
  selectedMovie.value = movie
  setTimeout(() => { showDetail.value = true }, 200)
}

async function searchByKeyword() {
  if( keyword.value != '' ) {
    loading.value=true
    const data = await fetchMoviesInfoByKeyword(keyword.value, page.value, region.value, year.value)
    moviesInfo.value = { results: data.results, pages: data.total_pages }
    loading.value=false
  } else {
    // @ts-ignore
    ElMessage.warning({
      showClose: true,
      message: '需要关键词！',
    })
  }
}

function getPosterUrl(path: string) {
  return `https://image.tmdb.org/t/p/original${path}`
}

onMounted(() => {
  const currentYear = new Date().getFullYear()
  years.value = Array.from({ length: currentYear - 1979 }, (_, i) => (currentYear - i).toString())
})

onMounted(async () => {
  // 获取电影分类信息
  const cached = localStorage.getItem('movieGenresInfo')
  if (cached) {
    genresInfo.value = JSON.parse(cached)
  } else {
    const result = await fetchMovieGenresInfo()
    genresInfo.value = result
    localStorage.setItem('movieGenresInfo', JSON.stringify(result))
  }
})
</script>

<template>
  <div class="search">
    <el-input
        v-model="keyword"
        placeholder="请输入关键词"
        class="search-input">
      <template #prepend>
        <el-button :icon="Search"
                   style="width: 60px"
                   @click="searchByKeyword"/>
      </template>
      <template #append>
        <el-select
            v-model="region"
            placeholder="选择地区"
            style="width: 120px; margin-right: 10px; margin-left: -10px">
          <el-option label="美国" value="US"></el-option>
          <el-option label="日本" value="JP"></el-option>
          <el-option label="中国大陆" value="CN"></el-option>
          <el-option label="韩国" value="KR"></el-option>
          <el-option label="英国" value="GB"></el-option>
          <el-option label="法国" value="FR"></el-option>
          <el-option label="德国" value="DE"></el-option>
          <el-option label="印度" value="IN"></el-option>
          <el-option label="意大利" value="IT"></el-option>
          <el-option label="加拿大" value="CA"></el-option>
          <el-option label="澳大利亚" value="AU"></el-option>
          <el-option label="西班牙" value="ES"></el-option>
          <el-option label="墨西哥" value="MX"></el-option>
          <el-option label="巴西" value="BR"></el-option>
          <el-option label="俄罗斯" value="RU"></el-option>
          <el-option label="中国香港" value="HK"></el-option>
          <el-option label="中国台湾" value="TW"></el-option>
          <el-option label="泰国" value="TH"></el-option>
        </el-select>
        <el-select
            v-model="year"
            placeholder="选择年份"
            style="width: 120px; margin-left: 0; margin-right: -10px">
          <el-option
              v-for="year in years"
              :key="year"
              :label="year"
              :value="year"
          />
        </el-select>
      </template>
    </el-input>

    <div class="movie-info">
      <el-skeleton v-if="loading"
                   :loading="loading" animated
                   v-for="n in 5"
                   class="movie-card">
        <template #template>
          <el-skeleton-item variant="image" style="width: 220px; height: 220px" />
          <div style="width: 25%; margin-left: 10px">
            <el-skeleton-item variant="p" style="width: 60%" />
            <el-skeleton-item variant="p" style="width: 30%" />
            <el-skeleton-item variant="p" style="width: 40%" />
            <el-skeleton-item variant="p" style="width: 50%" />
          </div>
          <div style="width: 30%;">
            <el-skeleton-item variant="text" style="width: 80%" />
            <el-skeleton-item variant="text" style="width: 80%" />
            <el-skeleton-item variant="text" style="width: 80%" />
            <el-skeleton-item variant="text" style="width: 80%" />
          </div>
          <el-skeleton-item variant="image" style="width: 440px; height: 220px" />
        </template>
      </el-skeleton>
      <div v-else-if="moviesInfo!=undefined && moviesInfo.results.length > 0"
           class="movie-card"
           v-for="movie in moviesInfo.results"
           @click="handleMovieClick(movie)">
        <div class="card-header">
          <img style="width: 100%; height: 100%"
              :src="getPosterUrl(movie.poster_path)"
              :alt="movie.title" />
        </div>
        <div class="card-body">
          <div style="width: 40%;">
            <h3>{{ movie.title }}</h3>
            <p><strong>上映日期：</strong>{{ movie.release_date }}</p>
            <p>
              <strong>分类：</strong>
              <span v-for="(id, index) in movie.genre_ids" :key="id">
                {{ genresInfo?.genres?.find((g) => g.id === id)?.name || '未知' }}
              <span v-if="index < movie.genre_ids.length - 1"> / </span>
              </span>
            </p>
            <p><strong>评分：</strong>{{ movie.vote_average }}</p>
          </div>
          <div v-if="movie.overview!=''"
              style="width: 60%; max-height: 10em; overflow-y: auto; text-overflow: ellipsis;">
            <strong>概述：</strong>{{ movie.overview }}
          </div>
          <el-empty v-else description="暂无概述" style="width: 60%; height: 100%"/>
        </div>
        <div class="card-footer">
          <img v-if="movie.backdrop_path!=null"
              style="width: 100%; height: 100%"
              :src="getPosterUrl(movie.backdrop_path)"
              :alt="movie.title" />
          <el-empty v-else description="暂无图片" style="width: 100%; height: 100%"/>
        </div>
      </div>
      <el-empty v-else />
    </div>

    <div class="pagination"
        v-if="moviesInfo!=undefined">
      <el-pagination background layout="prev, pager, next"
                     v-model:current-page="page"
                     :total="moviesInfo.pages * 10"
                     @current-change="searchByKeyword"/>
    </div>
  </div>

  <el-drawer v-model="showDetail"
             v-if="selectedMovie!=undefined"
             size="40%"
             :with-header="false"
             resizable
  >
    <MovieDetail :movie="selectedMovie" />
  </el-drawer>
</template>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.search-input {
  margin: 50px 0;
  max-width: 1000px;
  width: 70%;
  height: 60px;
}

.movie-info {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.movie-card {
  max-width: 1600px;
  width: 90%;
  height: 220px;
  display: flex;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  flex: 0 0 15%;
  margin: 4px;
  border-radius: 8px;
  overflow: hidden;
}

.card-header img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  flex: 0 0 50%;
  display: flex;
  padding: 20px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
}

.card-body h3 {
  margin: 10px 0;
  font-size: 20px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-body p {
  margin: 6px 0;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-body strong {
  color: var(--el-text-color-primary);
  font-size: 18px;
}

.card-footer {
  flex: 0 0 35%;
  margin: 4px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.card-footer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.85);
  transition: filter 0.3s ease;
}

.movie-card:hover .card-footer img {
  filter: brightness(1);
}

.pagination {
  margin: 50px 0;
}
</style>
