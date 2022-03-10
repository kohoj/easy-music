<template>
    <el-container class="container">
        <el-header height="80px">
            <Header>
                <el-col :span="1" @click="darkMode">
                    <div class="sun" v-if="isDark">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="36px"
                            viewBox="0 0 20 20"
                            fill="#999"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <div class="moon" v-else>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="36px"
                            viewBox="0 0 20 20"
                            fill="#335eea"
                        >
                            <path
                                d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                            />
                        </svg>
                    </div>
                </el-col>
            </Header>
        </el-header>
        <el-main>
            <div class="layout">
                <router-view></router-view>
            </div>
            <el-backtop target=".el-main" bottom="100">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                    />
                </svg>
            </el-backtop>
        </el-main>
        <Login v-show="loginDialogVisible" />
        <PlayBar />
    </el-container>
</template>

<script setup>
import Header from '@components/Header.vue'
import Login from '@components/Login.vue'
import PlayBar from '@components/PlayBar.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

// 暗黑模式
import {
    enable as enableDarkMode,
    disable as disableDarkMode,
} from 'darkreader';

const isDark = ref(false);
const darkMode = () => {
    if (isDark.value) {
        isDark.value = false;
        disableDarkMode();
        return
    }
    isDark.value = true;
    enableDarkMode({
        brightness: 100,
        contrast: 95,
        sepia: 0,
    });
}

const store = useStore();
const loginDialogVisible = computed(() => store.getters.loginDialogVisible);
</script>

<style scoped>
.container {
    height: 100%;
}
.layout {
    min-height: calc(100vh - 80px - 40px);
}
.sun,
.moon {
    cursor: pointer;
}
</style>
