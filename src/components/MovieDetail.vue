<script setup lang="ts">
import {type MovieCreditInfo, type MovieInfo, type MovieReviewInfo} from "@/api/responsePanel.ts";
import { ref, onMounted, computed, watch } from "vue";
import { fetchMovieCredits, fetchMovieReviews, fetchSimilarMovies } from "@/api/getMovieInfo.ts";

// 子组件需要的参数
const props = defineProps<{ movie: MovieInfo }>()

// 演职人员数据
const credits = ref<{ cast: MovieCreditInfo[] }>({ cast: [] })
// 评论数据
const reviews = ref<{ results: MovieReviewInfo[] }>({ results: [] })
// 相似的电影
const similar = ref<{ results: MovieInfo[] }>({ results: [] });

// 是否在加载
const loading = ref<boolean>(false);

async function load(movieId: number) {
  loading.value = true
  credits.value = await fetchMovieCredits(movieId)
  reviews.value = await fetchMovieReviews(movieId)
  similar.value = await fetchSimilarMovies(movieId)
  loading.value = false
}

const backgroundStyle = computed(() => ({
  backgroundImage: `url(https://image.tmdb.org/t/p/original${props.movie.backdrop_path})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "blur(10px)",
}));

function getPosterUrl(path: string) {
  return `https://image.tmdb.org/t/p/original${path}`;
}

onMounted(async () => {
  await load(props.movie.id)
})

watch(
  () => props.movie.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      await load(newId)
    }
  }
)
</script>

<template>
  <div class="movie-detail-page">
    <div class="background" :style="backgroundStyle"></div>

    <div class="content">
      <div class="movie-info-card">
        <div style="margin: 20px">
          <img class="poster" :src="getPosterUrl(movie.poster_path)" :alt="movie.title" />
        </div>

        <div class="info">
          <h2 class="title">{{ movie.title }}</h2>
          <p class="subtitle">原名：{{ movie.original_title }}</p>

          <p><strong>上映日期：</strong>{{ movie.release_date }}</p>
          <p><strong>评分：</strong>{{ movie.vote_average }} / 10 （共 {{ movie.vote_count }} 人评分）</p>
          <p><strong>人气值：</strong>{{ movie.popularity }}</p>

          <p class="overview">
            <strong>剧情简介：</strong><br />
            {{ movie.overview }}
          </p>
        </div>
      </div>

      <div class="credits-section">
        <h3>演职人员</h3>
        <div v-if="credits.cast.length === 0" class="no-credits">暂无信息</div>
        <div v-else-if="loading" class="no-credits">正在加载</div>
        <div v-else class="credits-scroll">
          <div class="credits-row">
            <el-card
                v-for="person in credits.cast"
                :key="person.id"
                class="credit-card"
            >
              <template #header>
                <img v-if="person.profile_path"
                    :src="getPosterUrl(person.profile_path)"
                    alt="profile"
                    class="credit-avatar"
                />
              </template>
              <div class="credit-info">
                <div style="font-size: 14px; font-weight: bold">
                  {{ person.name }}
                </div>
                <div style="font-size: 12px; ">
                  {{ person.original_name }}
                </div>
              </div>
            </el-card>
         </div>
        </div>
      </div>

      <div class="reviews-section">
        <h3>观众评论</h3>
        <div v-if="reviews.results.length === 0" class="no-reviews">暂无评论</div>
        <div v-else-if="loading" class="no-reviews">正在加载</div>
        <div v-else>
          <div
              v-for="review in reviews?.results"
              :key="review.id"
              class="review-item"
          >
            <div class="review-header">
              <div class="author">{{ review.author }} </div>
              <div class="time">
                写于{{ new Date(review.created_at).toLocaleDateString('zh-CN') }}
              </div>
            </div>
            <div class="review-content">
              {{ review.content }}
            </div>
            <div class="review-footer">
              <a :href="review.url" target="_blank">查看原文 →</a>
            </div>
          </div>
        </div>
      </div>

      <div class="similar-section">
        <h3>相似电影推荐</h3>
        <div v-if="similar.results.length === 0" class="no-similar">暂无推荐</div>
        <div v-else-if="loading" class="no-similar">正在加载</div>
        <div v-else class="similar-scroll">
          <div class="similar-row">
            <el-card
                v-for="movie in similar.results"
                :key="movie.id"
                class="similar-card"
            >
              <template #header>
                <img
                    v-if="movie.poster_path"
                    :src="getPosterUrl(movie.poster_path)"
                    alt="poster"
                    class="similar-poster"
                />
              </template>
              <div class="similar-info">
                <div style="font-size: 14px; font-weight: bold">
                  {{ movie.title }}
                </div>
                <div style="font-size: 12px; ">
                  {{ movie.release_date }}
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-detail-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #fff;
}

.background {
  position: absolute;
  inset: 0;
  z-index: 0;
  filter: blur(25px) brightness(0.5);
  transform: scale(1.1);
}

.content {
  position: relative;
  z-index: 1;
  padding: 60px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.movie-info-card {
  display: flex;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  backdrop-filter: blur(8px);
}

.poster {
  width: 300px;
  height: 450px;
}

.info {
  flex: 1;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  font-size: 28px;
  font-weight: bold;
}

.subtitle {
  font-size: 16px;
  color: #ccc;
}

.overview {
  margin-top: 12px;
  line-height: 1.6;
}

.credits-scroll, .similar-scroll {
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 8px;
  margin-top: 10px;
}

.credits-row, .similar-row {
  display: inline-flex;
  gap: 16px;
}

.credits-section, .reviews-section, .similar-section {
  margin-top: 40px;
  width: 100%;
  max-width: 900px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 16px;
  padding: 20px 30px;
}

.credit-card::v-deep(.el-card__header), .similar-card::v-deep(.el-card__header) {
  padding: 0;
  border: none;
}

.credit-card::v-deep(.el-card__body), .similar-card ::v-deep(.el-card__body) {
  padding: 0;
  border: none;
}

.credit-card {
  width: 120px;
  height: 230px;
  display: block;
  border-radius: 8px;
}

.similar-card {
  width: 160px;
  height: 270px;
  border-radius: 10px;
  overflow: hidden;
}

.credit-avatar {
  width: 100%;
  height: 180px;
}

.credit-info, .similar-info {
  display: flex;
  flex-direction: column;
  padding: 0 4px;
}

.similar-poster {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.reviews-section h3 {
  font-size: 20px;
  margin-bottom: 15px;
}

.no-credits, .no-reviews, .no-similar {
  color: #bbb;
  font-style: italic;
}

.review-item {
  margin-bottom: 12px;
  line-height: 1.5;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 12px;
}

.review-content {
  line-height: 1.6;
  font-size: 15px;
  color: #eee;
  white-space: pre-wrap;
  margin-bottom: 10px;
}

.review-footer {
  text-align: right;
}

.review-footer a {
  color: #f39c12;
  font-size: 14px;
  text-decoration: none;
  transition: 0.2s;
}

.review-footer a:hover {
  color: #ffd56b;
  text-decoration: underline;
}
</style>
