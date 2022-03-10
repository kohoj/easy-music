<template>
    <div class="header">
        <div class="w1200">
            <el-row class="wrapper">
                <el-col :span="12">
                    <ul class="nav">
                        <li
                            :class="{ 'is-active': menuActive == item.path }"
                            v-for="item in menuList"
                            :key="item.path"
                            @click="selectMenu(item.path)"
                        >
                            <span>{{ item.name }}</span>
                        </li>
                    </ul>
                </el-col>
                <el-col :span="3"></el-col>
                <el-col :span="6">
                    <div class="search">
                        <el-popover placement="bottom" :width="200" trigger="click">
                            <template #reference>
                                <el-input
                                    class="keyVal"
                                    placeholder="请输入歌名、歌词、歌手或专辑"
                                    v-model="keyVal"
                                    @focus="handleFocus"
                                    @input="handleInput"
                                    clearable
                                ></el-input>
                            </template>
                            <div class="hot-search" v-if="!keyVal">
                                <h5>热门搜索</h5>
                                <div class="hot-search-list">
                                    <div
                                        class="hot-item"
                                        v-for="(item, index) in serachHot"
                                        :key="index"
                                        @click="jumpSearch(item)"
                                    >
                                        <span
                                            :class="[index < 3 ? 'top-' + index : '']"
                                        >{{ (index + 1) + '.' }}</span>
                                        {{ item.first }}
                                    </div>
                                </div>
                            </div>
                            <div class="search-key-list" v-else>
                                <div
                                    class="search-item"
                                    v-for="(item, index) in suggestInfo.order"
                                    :key="index"
                                >
                                    <h6>{{ listType[item] }}</h6>
                                    <div class="item-main">
                                        <div
                                            class="list"
                                            v-for="(val, k) in suggestInfo[item]"
                                            :key="k"
                                            @click="jumpPage(val, item)"
                                        >
                                            {{ val.name }}
                                            <template v-if="item === 'songs'">
                                                -
                                                <span
                                                    v-for="(a, i) in val.artists"
                                                    :key="i"
                                                >{{ a.name + (i !== 0 ? ' / ' : '') }}</span>
                                            </template>
                                            <template v-else-if="item === 'albums'">
                                                -
                                                <span>{{ val.artist.name }}</span>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-popover>
                    </div>
                </el-col>
                <el-col :span="2" :class="isLogin ? 'user-avatar' : 'login'">
                    <div class="logined" v-if="isLogin">
                        <el-dropdown placement="bottom" @command="userMenuHandler">
                            <el-image :src="userInfo.avatarUrl" class="avatar">
                                <div slot="placeholder" class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </el-image>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="quit">
                                        <i class="iconfont icon-quit"></i>退出
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <span class="login-btn" @click="loginDialog" v-else>登录</span>
                </el-col>
                <slot></slot>
            </el-row>
        </div>
    </div>
</template>
<script>
import { computed, getCurrentInstance, reactive, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        const { proxy } = getCurrentInstance();
        const menuList = reactive([{
            name: '首页',
            path: '/index'
        }, {
            name: '排行榜',
            path: '/rank'
        }, {
            name: '歌单',
            path: '/playlist'
        }, {
            name: 'MV',
            path: '/mvlist'
        }, {
            name: '歌手',
            path: '/artist'
        }]);
        const route = useRoute();
        const router = useRouter();
        const info = reactive({
            keyVal: '',
            serachHot: [],
            suggestInfo: {},
            isShowSearch: false
        })

        // 切换导航跳转
        const selectMenu = (item) => {
            if (isLogin.value || item.indexOf('/my') < 0) {
                router.push({
                    path: item
                })
            } else {
                loginDialog()
            }
        };
        // 当前选择菜单
        const menuActive = computed(() => route.path);
        // 是否显示登录弹窗
        const loginDialog = () => store.commit('setLoginDialog', true);
        // 登录成功后，获取用户信息
        const isLogin = computed(() => store.getters.isLogin);
        const userInfo = computed(() => store.getters.userInfo);

        // 头像下来菜单，点击跳转
        const userMenuHandler = () => { logout() };

        const logout = async () => {
            const { data: res } = await proxy.$http.logout()

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            proxy.$msg.success('退出成功')
            window.localStorage.removeItem('token')
            window.localStorage.removeItem('cookie')
            window.localStorage.removeItem('userInfo');
            window.localStorage.removeItem('isLogin');
            store.commit('setUserInfo', {});
            store.commit('SET_LOGIN', false);

            if (route.path.indexOf('/my') >= 0) {
                router.push({ path: '/' })
            }
        };

        const getSearchHot = async () => {
            const { data: res } = await proxy.$http.serachHot()

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            info.serachHot = res.result.hots
        };

        const getSerachSuggest = async () => {
            const { data: res } = await proxy.$http.serachSuggest({ keywords: info.keyVal })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            info.suggestInfo = res.result
        };

        // 默认热门搜索列表，点击后台跳转到搜索结果页面
        const jumpSearch = (item) => {
            info.isShowSearch = false
            info.keyVal = item.first
            if (item.first === route.query.key) {
                return
            }
            router.push({ path: '/search', query: { key: item.first } })
        };

        // 搜索建议列表，点击后跳转到相对应的落地页
        const jumpPage = (item, type) => {
            info.keyVal = item.name
            switch (type) {
                case 'songs':
                    router.push({ path: '/song', query: { id: item.id } })
                    break
                case 'artists':
                    router.push({ path: '/singer', query: { id: item.id } })
                    break
                case 'albums':
                    router.push({ path: '/album', query: { id: item.id } })
                    break
                case 'playlists':
                    router.push({ path: '/playlist/detail', query: { id: item.id } })
                    break
            }
            info.isShowSearch = false
        };

        const showSearch = () => {
            // 显示搜索列表 若有关键词显示搜索建议，否则显示默认热门搜索列表
            if (!info.keyVal) {
                info.serachHot = []
                getSearchHot()
            } else {
                info.suggestInfo = {}
                getSerachSuggest()
            }
        };

        const search = () => {
            // 点击搜索关键词，跳转到搜索结果页面
            if (info.keyVal) {
                router.push({ path: '/search', query: { key: info.keyVal } })
                info.isShowSearch = false
            }
        };

        const handleInput = () => {
            if (info.keyVal) {
                showSearch()
                info.isShowSearch = true
            } else {
                info.isShowSearch = false
            }
        };

        const handleFocus = () => {
            showSearch()
            info.isShowSearch = true
        };

        const handleClose = () => {
            info.isShowSearch = false
        };

        return {
            ...toRefs(info),
            menuList,
            menuActive,
            selectMenu,
            loginDialog,
            userInfo,
            isLogin,
            userMenuHandler,
            jumpSearch,
            jumpPage,
            handleInput,
            handleFocus,
            handleClose
        }
    },
}
</script>
<style lang="less" scoped>
.header {
    position: relative;
    z-index: 2;
    font-size: 0;
    box-shadow: 0 2px 10px 0 rgba(52, 52, 52, 0.1);
    background: #fff;
}
.wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.nav {
    border: 0;
    font-size: 0;
    li {
        display: inline-block;
        padding: 0;
        height: 78px;
        line-height: 80px;
        color: #909399;
        cursor: pointer;
        border-bottom: 2px solid transparent;
    }
    .is-active {
        border-bottom: 3px solid @color-theme;
        font-weight: 700;
        color: #303133;
    }
    span {
        padding: 0 20px;
        display: block;
        font-size: 16px;
    }
}

.search {
    position: relative;
    display: block;
    text-align: right;

    .keyVal {
        width: 226px;
        line-height: 32px;
        border: 0;
        border-bottom: 1px solid #999;

        :deep(input) {
            padding: 0;
            border: none;
        }
    }
}
.hot-search {
    h5 {
        font-size: 18px;
    }

    .hot-search-list {
        padding: 10px 0;
    }
    .hot-item {
        line-height: 28px;
        cursor: pointer;

        .top-0 {
            font-weight: bold;
            color: rgba(255, 0, 0, 1);
        }

        .top-1 {
            font-weight: bold;
            color: rgba(255, 0, 0, 0.6);
        }

        .top-2 {
            font-weight: bold;
            color: rgba(255, 0, 0, 0.4);
        }

        img {
            display: inline-block;
            width: auto;
            height: 16px;
            padding: 6px 0;
            vertical-align: top;
        }
    }
}
.search-item {
    border-top: solid 1px #f2f2f2;
    margin: -1px -12px 0;

    h6 {
        font-size: 14px;
        line-height: 36px;
        color: #666;
        padding: 0 12px;
    }

    .list {
        line-height: 36px;
        color: #999;
        padding: 0 12px 0 40px;
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;

        &:hover {
            color: #fff;
            background: @color-theme;
        }
    }

    &:first-child {
        border: 0;
    }
}
.user-avatar {
    text-align: center;

    .avatar {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 100%;
        overflow: hidden;
        cursor: pointer;
    }

    .el-dropdown {
        padding: 20px 0;
        font-size: 0;
    }
}
.login {
    text-align: center;

    .login-btn {
        font-size: 16px;
        cursor: pointer;
    }
}
</style>