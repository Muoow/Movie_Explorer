<script setup lang="ts">
import {ref, onMounted, watch, onUnmounted} from 'vue'
import { ArrowDown, ArrowLeft } from '@element-plus/icons-vue'
import { type MovieGenresInfo, type MovieInfo, type MovieQueryParams } from "@/api/responsePanel.ts";
import { fetchMovieGenresInfo, fetchMoviesInfo } from "@/api/getMovieInfo.ts";
import MovieDetail from "@/components/MovieDetail.vue";

// 卡片折叠
const sortCollapse = ref(false)
const searchCollapse = ref(false)

// 筛选条件
const rating = ref<[number, number]>([0, 10])
const minVotes = ref<number>(0)
const duration = ref<[number, number]>([0, 240])
const dateRange = ref<string[]>(["2020-1-1T16:00:00.000Z", "2025-12-31T16:00:00.000Z" ])
const selectedGenres = ref<number[]>([])
const sortBy = ref<string>('')
const page = ref<number>(1)

// 电影信息
const genresInfo = ref<MovieGenresInfo>()
const moviesInfo = ref<{results: MovieInfo[]; pages: number}>()
const loading = ref<boolean>(false)

// 选中的电影
const selectedMovie = ref<MovieInfo>()
const showDetail = ref<boolean>(false)

function handleMovieClick(movie: any) {
  selectedMovie.value = movie
  setTimeout(() => { showDetail.value = true }, 200)
}

// 实际结果显示和字段对应
const options = ref([
  { id: "popularity.dsc", name: "热门降序" },
  { id: "popularity.asc", name: "热门升序" },
  { id: "vote_average.dsc", name: "评分降序" },
  { id: "vote_average.asc", name: "评分升序" },
  { id: "primary_release_date.dsc", name: "发行日期降序" },
  { id: "primary_release_date.asc", name: "发行日期升序" },
  { id: "title.asc", name: "片名(A-Z)" },
  { id: "title.dsc", name: "片名(Z-A)" },
]);

// 异步获取电影信息
async function getFilteredMovies() {
  loading.value = true
  try {
    const params = {
      primary_release_date_gte: formatDate(dateRange.value[0]),
      primary_release_date_lte: formatDate(dateRange.value[1]),
      vote_average_gte: rating.value[0],
      vote_average_lte: rating.value[1],
      vote_count_gte: minVotes.value,
      with_runtime_gte: duration.value[0],
      with_runtime_lte: duration.value[1],
      with_genres: selectedGenres.value.length ? selectedGenres.value.join(',') : undefined,
      sort_by: sortBy.value,
      page: page.value,
    }

    const data = await fetchMoviesInfo(params)
    moviesInfo.value = { results: data.results, pages: data.total_pages }
  }
  catch (err: any) {
    console.error(err)
  }
  finally {
    loading.value = false
  }
}

// 获取完整的海报地址
function getPosterUrl(path: string) {
  return `https://image.tmdb.org/t/p/original${path}`
}

// 格式化日期
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const STORAGE_KEY = 'movieFilterSettings'

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
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const data = JSON.parse(saved)
    rating.value = data.rating ?? rating.value
    minVotes.value = data.minVotes ?? minVotes.value
    duration.value = data.duration ?? duration.value
    dateRange.value = data.dateRange ?? dateRange.value
    selectedGenres.value = data.selectedGenres ?? selectedGenres.value
    sortBy.value = data.sortBy ?? sortBy.value
    page.value = data.page ?? page.value
  }
  // 默认条件筛选一次电影
  await getFilteredMovies()
})

onUnmounted(() => {
  const data = {
    rating: rating.value,
    minVotes: minVotes.value,
    duration: duration.value,
    dateRange: dateRange.value,
    selectedGenres: selectedGenres.value,
    sortBy: sortBy.value,
    page: page.value
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
})
</script>

<template>
<div class="page-container">
  <div class="movie-display">
    <el-skeleton v-if="loading" :loading="loading" animated
        v-for="n in 10" style="width: 280px">
      <template #template>
        <el-skeleton-item variant="image" style="width: 280px; height: 420px" />
        <div style="padding: 10px 0">
          <el-skeleton-item variant="p" style="width: 100%" />
          <el-skeleton-item variant="p" style="width: 60%" />
          <el-skeleton-item variant="text" style="width: 30%" />
        </div>
      </template>
    </el-skeleton>
    <el-card v-else-if="moviesInfo != null && moviesInfo.results.length > 0"
        v-for="movie in moviesInfo.results" class="movie-card"
        :body-style="{ padding: '0px' }"
        @click="handleMovieClick(movie)">
      <img v-if="movie.poster_path!=null"
           style="width: 280px; height: 420px"
           :src="getPosterUrl(movie.poster_path)"
           :alt="movie.original_title"
      />
      <el-empty v-else style="width: 280px; height: 420px"/>
      <div style="padding: 10px;">
        <el-progress
            style="margin-bottom: 10px"
            :percentage="(movie.vote_average * 10).toFixed(0)"
            :text-inside="true"
            :stroke-width="20"
            :status="movie.vote_average > 7 ? 'success' : 'warning'"
        />
        <div class="movie-title">
          {{ movie.title }}
        </div>
        <div class="movie-date">
          {{ movie.release_date }}
        </div>
      </div>
    </el-card>

    <div class="pagination"
         v-if="moviesInfo!=undefined">
      <el-pagination background layout="prev, pager, next"
                     v-model:current-page="page"
                     :total="moviesInfo.pages * 10"
                     @current-change="getFilteredMovies"/>
    </div>
  </div>

  <div class="movie-filter">
    <el-card class="filter-item">
      <header class="filter-header" @click="sortCollapse = !sortCollapse">
        <span style="flex: 1;">排序</span>
        <el-icon>
          <ArrowDown v-if="sortCollapse"/>
          <ArrowLeft v-else/>
        </el-icon>
      </header>
      <div v-show="sortCollapse">
        <div class="sort-block">
          <div style="margin-bottom: 20px">结果排序</div>
          <el-select v-model="sortBy" placeholder="请选择" :props="options">
            <el-option
                v-for="opt in options"
                :key="opt.id"
                :label="opt.name"
                :value="opt.id"
            />
          </el-select>
        </div>
      </div>
    </el-card>
    <el-card class="filter-item">
      <header class="filter-header" @click="searchCollapse = !searchCollapse">
        <span style="flex: 1;">筛选</span>
        <el-icon>
          <ArrowDown v-if="searchCollapse"/>
          <ArrowLeft v-else/>
        </el-icon>
      </header>

      <div v-show="searchCollapse" class="filter-options">
        <div class="filter-block">
          <div class="filter-label">
            <span>发行日期</span>
          </div>
          <el-date-picker
              style="width: 90%; margin: 10px 0"
              v-model="dateRange"
              type="monthrange"
              range-separator="--"
              start-placeholder="Start month"
              end-placeholder="End month"
          />
        </div>

        <div class="filter-block">
          <div class="filter-label">
            <span>类型</span>
          </div>
          <el-checkbox-group v-model="selectedGenres" class="genre-checkbox-group">
            <div v-for="genre in genresInfo?.genres" :key="genre.id" class="genre-checkbox-item">
              <el-checkbox :label="genre.id">{{ genre.name }}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

        <div class="filter-block">
          <div class="filter-label">
            <span>最少人数投票</span>
            <span class="filter-value">{{ minVotes }} (人)</span>
          </div>
          <el-slider
              v-model="minVotes"
              :max="500"
              :step="10"
              show-tooltip
          />
        </div>

        <div class="filter-block">
          <div class="filter-label">
            <span>用户评分</span>
            <span class="filter-value">{{ rating[0] }} - {{ rating[1] }} (分)</span>
          </div>
          <el-slider
              v-model="rating"
              range
              :max="10"
              :step="0.5"
              show-tooltip
          />
        </div>

        <div class="filter-block">
          <div class="filter-label">
            <span>时长</span>
            <span class="filter-value">{{ duration[0] }} - {{ duration[1] }} (分钟)</span>
          </div>
          <el-slider
              v-model="duration"
              range
              :max="240"
              :step="10"
              show-tooltip
          />
        </div>
      </div>
    </el-card>
    <el-button class="search-button" type="primary" @click="getFilteredMovies()">
      <h2>搜索</h2>
    </el-button>
  </div>

  <el-drawer v-model="showDetail"
             v-if="selectedMovie!=undefined"
             size="40%"
             :with-header="false"
             resizable
  >
    <MovieDetail :movie="selectedMovie" />
  </el-drawer>
</div>
</template>

<style scoped>
.page-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.movie-display {
  width: calc(100vw - 620px);
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.movie-card {
  width: 280px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s transform;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-title {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.2em;
  height: 1.2em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 6px;
}

.movie-date {
  font-size: 12px;
  color: #888;
  line-height: 1.2em;
  height: 1.2em;
}

.pagination {
  margin: 50px 0;
}

.movie-filter {
  width: 350px;
  position: sticky;
  top: 10px;
  right: 20px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  margin: 10px 5px;
  cursor: pointer;
}

.filter-header {
  display: flex;
  font-size: 20px;
  font-weight: bold;
  border-bottom: #545c64 1px solid;
}

.filter-options {
  margin: 10px 0;
}

.sort-block, .filter-block {
  padding: 20px 0;
  border-bottom: #545c64 1px solid;
}

.filter-label {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #606266;
  margin-bottom: 8px;
}

.genre-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.genre-checkbox-item {
  width: calc(33.33% - 10px);
}

.search-button {
  width: 340px;
  height: 80px;
  margin-left: 5px;
  margin-top: 10px;
  border-radius: 30px;
}
</style>
