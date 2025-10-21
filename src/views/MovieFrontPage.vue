<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchMoviesInfoByType } from '@/api/getMovieInfo'
import type { MovieInfo } from '@/api/responsePanel'
import MovieDetail from "@/components/MovieDetail.vue"
import { Refresh } from '@element-plus/icons-vue'

// 每行显示多少部
const moviesPerRow = 6
const rowsToShow = 2
const moviesPerPage = moviesPerRow * rowsToShow

// 每个分类独立状态
interface Category {
  key: string
  title: string
  data: { results: MovieInfo[] }
  expanded: boolean
  page: number
  loading: boolean
}

const categories = ref<Category[]>([
  { key: 'now_playing', title: '正在热映', data: { results: [] }, expanded: false, page: 1, loading: true },
  { key: 'popular', title: '热门电影', data: { results: [] }, expanded: false, page: 1, loading: true },
  { key: 'top_rated', title: '高分电影', data: { results: [] }, expanded: false, page: 1, loading: true },
  { key: 'upcoming', title: '即将上映', data: { results: [] }, expanded: false, page: 1, loading: true },
])

// 选中的电影
const selectedMovie = ref<MovieInfo>()
const showDetail = ref(false)

onMounted(async () => {
  await Promise.all(categories.value.map(loadCategoryMovies))
})

async function loadCategoryMovies(category: Category) {
  category.loading = true
  try {
    const res = await fetchMoviesInfoByType(category.key as any, category.page)
    await new Promise(resolve => setTimeout(resolve, 600))
    category.data = res
  } catch (err) {
    console.error(`加载 ${category.title} 失败:`, err)
  } finally {
    category.loading = false
  }
}

async function refreshCategory(category: Category) {
  category.page++
  await loadCategoryMovies(category)
}

function visibleMovies(category: Category) {
  return category.expanded
      ? category.data.results
      : category.data.results.slice(0, moviesPerPage)
}

function toggleExpand(category: Category) {
  category.expanded = !category.expanded
}

function handleMovieClick(movie: MovieInfo) {
  selectedMovie.value = movie
  setTimeout(() => { showDetail.value = true }, 200)
}

// 获取海报 URL
function getPosterUrl(path: string) {
  return `https://image.tmdb.org/t/p/w500${path}`
}
</script>


<template>
  <div class="movie-section-container">
    <div
        v-for="(category, index) in categories"
        :key="index"
        class="movie-category-block"
    >
      <div class="header">
        <h2 class="category-title">{{ category.title }}</h2>
        <span style="flex: 1"></span>
        <el-button
            type="primary" size="large"
            @click="refreshCategory(category)"
        >
          <Refresh style="width: 1.5em; height: 1.5em; margin-right: 8px"/>
          <span style="font-size: 16px">换一批</span>
        </el-button>
      </div>

      <div v-if="category.loading" class="movie-list">
        <el-skeleton
            v-for="n in 12"
            :key="n"
            animated
            style="width: 280px"
        >
          <template #template>
            <el-skeleton-item variant="image" style="width: 280px; height: 420px" />
            <div style="padding: 10px 0">
              <el-skeleton-item variant="p" style="width: 100%" />
              <el-skeleton-item variant="p" style="width: 60%" />
            </div>
          </template>
        </el-skeleton>
      </div>

      <div v-else class="movie-list">
        <el-card
            v-for="movie in visibleMovies(category)"
            :key="movie.id"
            class="movie-card"
            :body-style="{ padding: '0px' }"
            @click="handleMovieClick(movie)"
        >
          <img
              v-if="movie.poster_path"
              :src="getPosterUrl(movie.poster_path)"
              :alt="movie.original_title"
              class="movie-poster"
          />
          <el-empty v-else class="movie-empty" />
          <div class="movie-info">
            <el-progress
                style="margin-bottom: 10px"
                :percentage="(movie.vote_average * 10).toFixed(0)"
                :text-inside="true"
                :stroke-width="18"
                :status="movie.vote_average > 7 ? 'success' : 'warning'"
            />
            <div class="movie-title">{{ movie.title }}</div>
            <div class="movie-date">{{ movie.release_date }}</div>
          </div>
        </el-card>
      </div>

      <div v-if="category.data.results.length > moviesPerPage" class="show-more">
        <el-button type="primary"
                   @click="toggleExpand(category)"
                   style="font-size: 20px; margin-top: 20px; width: 100%; height: 40px"
        >
          {{ category.expanded ? "收起" : "展示更多" }}
        </el-button>
      </div>
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
.movie-section-container {
  display: flex;
  flex-direction: column;
  padding: 10px 50px;
  gap: 20px;
}

.header {
  display: flex;
  align-items: center;
}

.category-title {
  font-size: 28px;
  font-weight: bold;
}

.movie-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;
}

.movie-card {
  width: 280px;
  cursor: pointer;
  transition: transform 0.3s;
  background: rgba(255, 255, 255, 0.08);
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 280px;
  height: 420px;
  object-fit: cover;
}

.movie-info {
  padding: 10px;
}

.movie-title {
  font-size: 16px;
  font-weight: bold;
}

.movie-date {
  font-size: 14px;
  color: #ccc;
}

.show-more {
  text-align: center;
  margin-top: 10px;
}
</style>
