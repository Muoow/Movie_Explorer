<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core"
import { useRouter } from "vue-router";
import { House, ChatDotRound, Location, Film, VideoCamera } from "@element-plus/icons-vue"

const isDark = useDark()
const toggleDark = useToggle(isDark)
const router = useRouter()
const handleThemeToggle = () => { toggleDark() }
</script>

<template>
<div class="logo-container">
  <el-icon style="margin-right: 10px"><VideoCamera /></el-icon>
  <span>Movie Explorer</span>
</div>

<el-menu
    :default-active="router.currentRoute.value.path"
    background-color="#545c64"
    active-text-color="#ffd04b"
    text-color="#fff"
    :collapse="false"
    :router="true" >
  <el-menu-item index="/home" class="menu-item">
    <el-icon>
      <House />
    </el-icon>
    <span>首页</span>
  </el-menu-item>

  <el-menu-item index="/discover" class="menu-item">
    <el-icon>
      <Film />
    </el-icon>
    <span style="font-size:16px">条件筛选</span>
  </el-menu-item>

  <el-menu-item index="/search" class="menu-item">
    <el-icon>
      <VideoCamera />
    </el-icon>
    <span style="font-size:16px">关键词搜索</span>
  </el-menu-item>

  <el-menu-item index="/cinema" class="menu-item">
    <el-icon>
      <Location />
    </el-icon>
    <span>附近影院</span>
  </el-menu-item>

  <el-menu-item @click="handleThemeToggle" class="menu-item">
    <el-icon>
      <House />
    </el-icon>
    <span>切换主题</span>
  </el-menu-item>

  <el-menu-item index="/about" class="menu-item">
    <el-icon>
      <ChatDotRound />
    </el-icon>
    <span>关于</span>
  </el-menu-item>
</el-menu>
</template>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  padding: 20px 15px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.menu-item {
  font-size: 16px;
}
</style>
