<template>
    <div class='rank'>
        <div class="w1200">
            <div class="rank-container">
                <div class="rank-aside">
                    <div class="rank-type">
                        <div class="type-hd">
                            <span :class="type === 'Top' ? 'active' : ''" @click="selectType('Top')">TOP榜</span>
                            <span :class="type === 'Feature' ? 'active' : ''" @click="selectType('Feature')">特色榜</span>
                            <span :class="type === 'Other' ? 'active' : ''" @click="selectType('Other')">场景榜</span>
                        </div>
                        <div class="type-main">
                            <div class="type-item" :class="rId == item.id ? 'active' : ''" v-for="(item, index) in list" :key="index" @click="selectItem(item)">
                                <el-image class="item-img" :src="item.coverImgUrl">
                                    <div slot="placeholder" class="image-slot">
                                        <i class="iconfont icon-placeholder"></i>
                                    </div>
                                </el-image>
                                <div class="item-info">
                                    <div class="item-title">
                                        {{item.name}}
                                    </div>
                                    <div class="item-time">
                                        {{item.updateFrequency}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rank-main">
                    <div class="rank-list-hd">
                        <el-image class="rank-img" :src="rankInfo.coverImgUrl">
                            <div slot="placeholder" class="image-slot">
                                <i class="iconfont icon-placeholder"></i>
                            </div>
                        </el-image>
                        <div class="rank-info" v-if="rankInfo">
                            <div class="rank-title">
                                {{rankInfo.name}} <span>({{$utils.formartDate(rankInfo.updateTime, 'MM月dd日')}} 更新)</span>
                            </div>
                            <div class="rank-tags" v-if="rankInfo.tags">
                                <router-link :to="{ path: '/playlist', query: { cat: tag }}" class="tag" v-for="(tag, index) in rankInfo.tags" :key="index">#{{tag}}</router-link>
                            </div>
                            <div class="rank-digital">
                                <span class="rank-playCount"><i class="iconfont icon-playnum"></i> {{$utils.formartNum(rankInfo.playCount)}}次</span>
                                <span class="rank-collect"><i class="iconfont icon-collect"></i> {{$utils.formartNum(rankInfo.subscribedCount)}}</span>
                                <span class="rank-comment"><i class="iconfont icon-comment"></i> {{$utils.formartNum(rankInfo.commentCount)}}</span>
                            </div>
                            <div class="rank-desc">
                                {{rankInfo.description}}
                            </div>
                        </div>
                    </div>
                    <div class="song-header">
                        <h4>歌曲列表 <em>{{total + '首歌'}}</em></h4>
                        <span class="play-all" @click="playAllSongs"><i class="iconfont icon-audio-play"></i> 播放全部</span>
                    </div>
                    <template v-if="isLoading">
                        <Loading />
                    </template>
                    <template v-else>
                        <song-list :songList="songList" :stripe="true"></song-list>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { formatSongInfo } from '@utils/song'
import SongList from '@components/SongList.vue'
import Loading from '@components/Loading.vue'
import { reactive, toRefs } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentInstance, onMounted, watchEffect } from '@vue/runtime-core'
import { useStore } from 'vuex'

export default {
    name: 'Rank',
    components: {
        SongList,
        Loading
    },
    setup(props) {
        const route = useRoute();
        const router = useRouter();
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const info = reactive({
            list: [],
            type: 'Top',
            listTop: [],
            listFeature: [],
            listOther: [],
            rId: 0,
            rankInfo: {},
            songList: [],
            isLoading: true,
            total: 0            
        });

        const getTopListDetail = async() => {
            const { data: res } = await proxy.$http.topListDetail()

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            // 云音乐TOP榜
            info.listTop = res.list.filter(item => {
                return item.ToplistType
            })
            // 云音乐特色榜
            info.listFeature = res.list.filter(item => {
                return !item.ToplistType && item.name.indexOf('云音乐') >= 0
            })
            // 其他场景榜
            info.listOther = res.list.filter(item => {
                return !item.ToplistType && item.name.indexOf('云音乐') < 0
            })

            info.list = info.type ? info['list' + info.type] : info.listTop
            info.rId = info.rId ? info.rId : info.listTop[0].id
        };

        const getListDetail = async() => {
            info.isLoading = true;
            const { data: res } = await proxy.$http.listDetail({ id: info.rId, s: -1 })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            info.rankInfo = res.playlist
            info.songList = _formatSongs(res.playlist.tracks, res.privileges)
            info.total = info.songList.length
            info.isLoading = false
        };

        const selectType = (type) => {
            info.type = type
            info.list = info['list' + info.type]
            info.rId = info['list' + type][0].id
            router.push({ path: 'rank', query: { type: info.type, rId: info.rId } })
        };

        const selectItem = (item) => {
            info.rId = item.id
            router.push({ path: 'rank', query: { type: info.type, rId: info.rId } })
        };

        const playAllSongs = () => {
            store.dispatch('playAll', {
                list: info.songList
            });
            store.commit('SET_PLAYLISTTIPS', true);
        };

        // 处理歌曲
        const _formatSongs = (list, privileges) => {
            const ret = []
            list.map((item, index) => {
                if (item.id) {
                    // 是否有版权播放
                    item.license = !privileges[index].cp
                    ret.push(formatSongInfo(item))
                }
            })
            return ret
        };

        onMounted(() => {
            info['type'] = route.query.type || info.type;
            info['rId'] = route.query.rId;
            getTopListDetail();
        });

        watchEffect(() => {
            if (info.rId) {
                getListDetail();
            }
        });

        return {
            ...toRefs(info),
            selectItem,
            selectType,
            playAllSongs
        }

    }
}
</script>
<style scoped lang="less">
.rank-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    padding: 40px 0 0 0;
}
.rank-aside {
    width: 300px;
    padding: 0 20px 100px 0;

    .rank-type {
        box-shadow: 0 0 20px 0 rgba(65,67,70,.05);
    }
}
.rank-main {
    flex: 1;
    padding: 0 20px 100px;
    overflow: hidden;
}

.type-hd {
    display: flex;
    padding: 20px 0;
    margin: 0 20px;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;

    span {
        position: relative;
        display: inline-block;
        height: 20px;
        line-height: 20px;
        font-weight: 300;
        color: #333;
        cursor: pointer;

        &.active {
            font-weight: 600;
            color: #000;

            &::after {
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
.type-main {
    padding: 10px 0;
}
.type-item {
    display: flex;
    padding: 10px 20px;
    cursor: pointer;

    .item-img {
        width: 60px;
        height: 60px;
    }

    .item-info {
        flex: 1;
        align-items: center;
        padding-left: 20px;
    }

    .item-title {
        display: block;
        font-weight: bold;
        line-height: 30px;
        padding-bottom: 15px;
    }

    .item-time {
        font-size: 12px;
        line-height: 12px;
        color: #999;
    }

    &:hover {
        background: #f5f5f5;
    }

    &.active {
        background: #efefef;
    }
}

.rank-list-hd {
    display: flex;

    .rank-img {
        width: 150px;
        height: 150px;
        padding: 5px;
        border: 1px solid #eee;
    }

    .rank-info {
        flex: 1;
        padding-left: 40px;
    }

    .rank-title {
        padding-bottom: 20px;
        font-size: 24px;
        font-weight: bold;

        span {
            display: inline-block;
            padding-left: 10px;
            font-weight: normal;
            line-height: 22px;
            font-size: 14px;
            color: #999;
        }
    }

    .rank-desc {
        line-height: 22px;
        font-size: 14px;
        color: #999;
    }

    .rank-tags {
        padding-bottom: 5px;
        line-height: 16px;

        .tag {
            display: inline-block;
            margin-right: 5px;
            font-size: 12px;
            color: @color-theme;
        }
    }
    .rank-playCount, .rank-collect, .rank-comment {
        display: inline-block;
        padding: 0 20px 5px 0;
        line-height: 16px;
        font-size: 14px;
        color: #999;

        i {
            vertical-align: top;
        }
    }
}

.song-header {
    display: flex;
    padding: 30px 0 10px;

    h4 {
        flex: 1;
        font-size: 20px;
        line-height: 40px;

        em {
            display: inline-block;
            padding-left: 10px;
            font-size: 12px;
            line-height: 14px;
            font-style: normal;
            font-weight: normal;
            color: #666;
            vertical-align: baseline;
        }
    }

    span {
        display: flex;
        line-height: 16px;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        padding: 7px 20px;
        cursor: pointer;
        margin: 5px 0 5px 15px;
        transition: all .4s;
        background: #f0f0f0;
        color: #333;

        i {
            margin-right: 3px;
        }
    }

    .play-all {
        color: #fff;
        background: @color-theme;

        i {
            color: #fff;
        }
    }

    .collect.active, .collect.active i {
        color: @color-theme;
    }
}
</style>
