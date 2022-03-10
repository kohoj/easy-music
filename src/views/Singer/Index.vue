<template>
    <div class='singer' v-if="artist">
        <div class="w1200">
            <div class="singer-info">
                <div class="singer-avatar">
                    <el-image :src="artist.img1v1Url">
                        <div slot="placeholder" class="image-slot">
                            <i class="iconfont icon-placeholder"></i>
                        </div>
                    </el-image>
                </div>
                <div class="singer-desc">
                    <div class="singer-author">
                        <div class="singer-name">{{artist.name}}</div>
                        <router-link v-if="artist.accountId" class="singer-btn singer-home" :to="{ path: '/user', query: { id: artist.accountId }}"><i class="iconfont icon-home"></i> 个人主页</router-link>
                        <span :class="['singer-btn', 'singer-collect', artist.followed ? 'active' : '']" @click="getArtistSub(artist.followed ? 0 : 1)"><i :class="['iconfont', 'icon-collect' + (artist.followed ? '-active' : '')]"></i> {{ artist.followed ? '已收藏' : '收藏'}}</span>
                    </div>
                    <div class="singer-brief">{{artist.briefDesc ? artist.briefDesc : '暂无简介'}} <span v-if="introduction.length" @click="moreDesc">更多>></span></div>
                </div>
            </div>
        </div>
        <div class="singer-main">
            <div class="w1200">
                <div class="singer-hd">
                    <em>作品集</em>
                    <div class="singer-tab">
                        <span :class="[ type === 'hot' ? 'active' : '']" @click="changeType('hot')">热门作品</span>
                        <span :class="[ type === 'album' ? 'active' : '']" @click="changeType('album')">所有专辑</span>
                        <span :class="[ type === 'mv' ? 'active' : '']" @click="changeType('mv')">相关MV</span>
                    </div>
                    <div class="singer-oper" v-if="type === 'hot'">
                        <span @click="playAllSongs" class="singer-btn playAll"><i class="iconfont icon-audio-play"></i> 播放全部</span>
                        <span @click="addAll" class="singer-btn addAll"><i class="iconfont icon-add"></i> 添加到播放列表</span>
                        <span @click="collectAll" class="singer-btn collectAll"><i class="iconfont icon-collect"></i> 收藏热门</span>
                    </div>
                </div>
                <div class="singer-list">
                    <song-list :songList="hotSongs" :stripe="true" v-show="type === 'hot'"></song-list>
                    <div v-show="type === 'album'">
                        <album-list :albumList="hotAlbums" :loading="album_loading" :num="album_count"></album-list>
                    </div>
                    <div class='wrapper infinite-list' v-show="type === 'mv'" v-infinite-scroll="loadMv" infinite-scroll-disabled="isLoadMv" infinite-scroll-distance="50">
                        <mv-list :mvList="hotMvs" :loading="mv_loading" :num="mv_count"></mv-list>
                        <template v-if="isLoading">
                            <Loading />
                        </template>
                    </div>

                    <!-- <div class="wrapper" v-show="type === 'mv'" v-infinite-scroll="loadMv" infinite-scroll-disabled="isLoadMv" infinite-scroll-distance="50" >
                        <mv-list class="loadMv" :mvList="hotMvs" :loading="mv_loading" :num="mv_count"></mv-list>
                    </div> -->
                </div>
                <div class="pagination" v-if="type === 'album'">
                    <el-pagination
                        @current-change="currentChange"
                        layout="prev, pager, next"
                        :page-size="limit"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog :title="artist.name" v-model="dialogDescVisible" :destroy-on-close="true">
            <div class="artist-desc-main">
                <dl class="introduction">
                    <dt>艺人介绍</dt>
                    <dd>{{artist.briefDesc}}</dd>
                </dl>
                <dl v-for="(item, index) in introduction" :key="index" class="introduction">
                    <dt>{{item.ti}}</dt>
                    <dd>{{item.txt}}</dd>
                </dl>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Loading from '@components/Loading.vue';
import SongList from '@components/SongList.vue'
import AlbumList from '@components/AlbumList.vue'
import MvList from '@components/MvList.vue'
import { reactive, toRefs } from '@vue/reactivity';
import { getCurrentInstance, onMounted } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';

export default {
    name: 'Singer',
    components: {
        SongList,
        AlbumList,
        MvList,
        Loading
    },
    setup(props) {
        const { proxy } = getCurrentInstance();
        const router = useRouter();
        const route = useRoute();
        const info = reactive({
            sUid: '',
            artist: null,
            hotSongs: [],
            hotAlbums: [],
            hotMvs: [],
            introduction: [],
            type: 'hot',
            limit: 12,
            offset: 0,
            total: 0,
            timer: null,
            dialogDescVisible: false,
            isLoading: true,
            isLoadMv: true,
            album_loading: true,
            album_count: 12,
            mv_count: 20,
            mv_loading: true,
        });

        const getArtistDesc = async() => {
            const { data: res } = await proxy.$http.artistDesc({ id: info.sUid, timestamp: new Date().valueOf() })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            info.introduction = res.introduction
        };

        const getArtists = async() => {
            const { data: res } = await proxy.$http.artists({ id: info.sUid, timestamp: new Date().valueOf() })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            info.artist = res.artist
            info.hotSongs = res.hotSongs.map(item => {
                return {
                    id: String(item.id),
                    name: item.name,
                    mvId: item.mv,
                    singer: item.ar,
                    album: item.al,
                    alia: item.alia,
                    vip: item.fee === 1,
                    license: item.license,
                    duration: proxy.$utils.formatSongTime(item.dt),
                    url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
                    publishTime: proxy.$utils.formatMsgTime(item.publishTime)
                }
            })
        };

        const getArtistSub = async(t) => {
            const { data: res } = await proxy.$http.artistSub({ id: info.sUid, t })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            proxy.$msg.success('操作成功')
            getArtists()
        };

        const getArtistAlbum = async() => {
            info.album_loading = true;
            const { data: res } = await proxy.$http.artistAlbum({ id: info.sUid, limit: info.limit, offset: info.offset })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            info.total = res.artist.albumSize
            info.hotAlbums = res.hotAlbums
            info.album_loading = false;
        };

        const getArtistMv = async() => {
            const { data: res } = await proxy.$http.artistMv({ id: info.sUid, limit: 20, offset: info.offset })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            info.hotMvs = [...info.hotMvs, ...res.mvs]
            info.isLoading = res.hasMore
            info.isLoadMv = !res.hasMore
            info.offset += 20
            info.mv_loading = false;
        };

        const loadMv = () => {
            getArtistMv()
        };

        const moreDesc = () => {
            info.dialogDescVisible = true
        };

        const changeType = (type) => {
            const params = {
                id: info.sUid
            }
            info.type = type
            info.offset = 0
            switch (info.type) {
                case 'hot' :
                    getArtists()
                break
                case 'album' :
                    getArtistAlbum()
                break
                case 'mv' :
                    info.hotMvs = []
                    info.mv_loading = true
                    getArtistMv()
                break
            }
            if (type !== 'hot') {
                params.type = info.type
            }
            router.push({ path: 'singer', query: params })
        };

        // 专辑分页
        const currentChange = (page) => {
            info.offset = (page - 1) * info.limit
            getArtistAlbum()
        };

        const init = () => {
            info.sUid = route.query.id
            getArtistDesc()
            switch (info.type) {
                case 'hot' :
                    getArtists()
                break
                case 'album' :
                    getArtistAlbum()
                break
                case 'mv' :
                    getArtistMv()
                break
            }
        };

        const playAllSongs = () => {
            store.dispatch('playAll', {
                list: info.songList
            });
        };

        const addAll = () => {
            store.dispatch('addList', { list: info.hotSongs });
            // this.setPlayListTips({ flag: true, txt: '已添加到播放列表' })
            // clearTimeout(this.timer)
            // this.timer = setTimeout(() => {
            //     this.setPlayListTips({ flag: false, txt: '已添加到播放列表' })
            // }, 2000)
        };

        // TODO收藏
        const collectAll = () => { };

        onMounted(() => {
            info.sUid = route.query.id;
            info.type = route.query.type || 'hot';

            init();
            route.query.type && getArtists();
        })

        return {
            ...toRefs(info),
            loadMv,
            currentChange,
            changeType,
            moreDesc,
            getArtistSub,
            playAllSongs,
            addAll,
            collectAll,
        }
    },
    watch: {
        // $route: {
        //     handler () {
        //         this.sUid = this.$route.query.id
        //     },
        //     deep: true
        // },
        // sUid (val, oldVal) {
        //     this.type = this.$route.query.type || 'hot'
        //     this.getArtists()
        // }
    },
    beforeDestroy () {
        clearTimeout(this.timer)
    }
}
</script>
<style scoped lang="less">
.singer {
    background: #f8f8f8;

    .singer-btn {
        display: inline-block;
        line-height: 16px;
        align-items: center;
        border-radius: 50px;
        padding: 7px 15px;
        cursor: pointer;
        margin: 5px 0 5px 15px;
        background: #fff;
        color: #333;
    }

    .playAll, .icon-audio-play {
        font-size: 14px;
        color: #fff;
        background: @color-theme;
    }

    .addAll, .collectAll {
        font-size: 14px;
        background: #f0f0f0;
    }
}
.singer-info {
    display: flex;
    padding: 40px 0;

    .singer-avatar {
        width: 200px;
        height: 200px;
        border-radius: 100%;
        overflow: hidden;

        .el-image {
            transition: all 1s;

            &:hover {
                transform: scale(1.1);
            }
        }
    }

    .singer-desc {
        flex: 1;
        padding-left: 50px;
    }

    .singer-author {
        padding-bottom: 16px;
    }

    .singer-name {
        display: inline-block;
        font-size: 40px;
        font-weight: 600;
        line-height: 40px;
        margin-right: 20px;
        vertical-align: top;
    }

    .singer-collect {
        &.active, .icon-collect-active {
            color: @color-theme;
        }
    }

    .singer-brief {
        line-height: 24px;
        color: #999;

        span {
            color: @color-theme;
            cursor: pointer;
        }
    }
}
.singer-main {
    padding: 50px 0 80px;
    background: #fff;
}
.singer-hd {
    display: flex;
    font-size: 0;

    em {
        display: inline-block;
        width: 85px;
        font-size: 28px;
        line-height: 28px;
        font-style: normal;
    }

    .singer-tab {
        flex: 1;
    }

    span {
        display: inline-block;
        font-size: 16px;
        margin: 0 24px;
        color: #666;
        cursor: pointer;

        &.active {
            position: relative;
            z-index: 1;
            font-weight: 600;
            color: #000;
            &:after {
                position: absolute;
                content: "";
                left: 0;
                bottom: 1px;
                width: 100%;
                height: 6px;
                background: @color-theme;
                z-index: -1;
            }
        }
    }
}
.artist-desc-main {
    max-height: 500px;
    overflow-y: auto;
}
.introduction {
    dt {
        position: relative;
        line-height: 14px;
        padding-bottom: 10px;
        color: #333;
        font-weight: bold;
        font-size: 14px;

        &::before {
            display: inline-block;
            content: '';
            width: 4px;
            height: 14px;
            margin-right: 10px;
            vertical-align: top;
            border-radius: 4px;
            background: @color-theme;
        }
    }

    dd {
        padding-bottom: 20px;
        font-size: 12px;
        line-height: 25px;
        white-space: pre-line;
        color: #666;
    }
}
.pagination {
    padding: 30px 0;
    text-align: center;
}
</style>
