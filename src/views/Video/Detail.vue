<template>
    <div v-if="videoOptions.src" class='video-detail'>
        <div class="mv-video">
            <div class="w1200">
                <div class="video-main">
                    <videoPlay 
                    width="100%" 
                    height="100%"
                    :poster="videoOptions.poster"
                    :src="videoOptions.src" />
                </div>
                <div class="video-info">
                    <div class="video-info-hd">
                        <div class="info-name">{{videoDetail.title}}</div>
                        <router-link :to="{ path: '/user', query: { id: videoDetail.creator.userId }}" v-if="videoDetail.creator" class="song-author">By. {{videoDetail.creator.nickname}}</router-link>
                        <div class="video-info-count">
                            <span class="info-count">播放量：{{$utils.formartNum(videoDetail.playCount)}}</span><span class="info-time">发布时间：{{$utils.formartDate(videoDetail.publishTime, 'yyyy-MM-dd')}}</span>
                        </div>
                    </div>
                    <div class="video-desc">
                        {{videoDetail.briefDesc ? videoDetail.briefDesc : '暂无简介'}}
                    </div>
                </div>
            </div>
        </div>
        <div class="w1200">
            <div class="video-container">
                <div class="video-main">
                    <comment-list :type="type" :sId="vId"></comment-list>
                </div>
                <div class="video-aside">
                    <div class="simi-mv">
                        <h3 class="aside-title">相关视频</h3>
                        <div class="aside-main video-main">
                            <div class="item" :key="'' + item.id + index" v-for="(item, index) in simiVideo">
                                <router-link :to="{ path: item.type ? '/video' : '/mv', query: { id: item.vid }}" class="faceImg">
                                    <i class="iconfont icon-play"></i>
                                    <el-image :src="item.coverUrl">
                                        <div slot="placeholder" class="image-slot">
                                            <i class="iconfont icon-placeholder"></i>
                                        </div>
                                    </el-image>
                                    <span class="playCount"><i class="iconfont icon-video"></i><em>{{$utils.formartNum(item.playTime)}}</em></span>
                                    <div class="v-time">{{$utils.formatSongTime(item.durationms)}}</div>
                                </router-link>
                                <div class="info">
                                    <router-link :to="{ path: '/video', query: { id: item.vid }}" class="v-name">{{item.title}}</router-link>
                                    <router-link :to="{ path: '/user', query: { uid: author.userId }}" class="v-author" v-for="(author, k) in item.creator" :key="k">By. {{ k !== 0 ? ' / ' + author.userName : author.userName }}</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CommentList from '@components/Comments.vue'
import { reactive, toRefs } from '@vue/reactivity'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { getCurrentInstance, onMounted } from '@vue/runtime-core'
import { useStore } from 'vuex'

import 'vue3-video-play/dist/style.css'
import { videoPlay } from 'vue3-video-play'

export default {
    name: 'videoDetail',
    components: {
        CommentList,
        videoPlay
    },
    setup(props) {
        const { proxy } = getCurrentInstance();
        const route = useRoute();
        const store = useStore();
        const info = reactive({
            vId: '0',
            videoDetail: {},
            type: 5, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
            videoOptions: {
                src: "", //视频源
                poster: "",
            },
            simiVideo: [],
        });

        const getVideoDetail = async() => {
            const { data: res } = await proxy.$http.videoDetail({ id: info.vId })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            
            info.videoDetail = res.data;
            info.videoOptions.poster = res.data.coverUrl;
        };

        const getMvUrl = async(r) => {
            const { data: res } = await proxy.$http.videoUrl({ id: info.vId, r })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            info.videoOptions.src = res.urls[0].url;
        };

        const getSimiVideo = async() => {
            const { data: res } = await proxy.$http.simiVideo({ id: info.vId })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            
            info.simiVideo = res.data
        };

        const init = () => {
            getVideoDetail();
            getMvUrl();
            getSimiVideo()
        };

        onBeforeRouteUpdate((to) => {
            info['vId'] = to.query.id;
            init();
        });

        onMounted(() => {
            info['vId'] = route.query.id;
            init();
            store.commit('SET_PLAYSTATUS', false);
        });

        return {
            ...toRefs(info),
        }
    }
}
</script>
<style scoped lang="less">
.mv-video {
    width: 100%;
    padding: 40px 0 20px;

    .video-box {
        width: 100%;
    }
}
.video-main {
    position: relative;

    .video-light {
        position: absolute;
        top: 50%;
        right: 0;
        width: 50px;
        height: 50px;
        line-height: 50px;
        margin-top: -25px;
        text-align: center;
        border-radius: 10px 0 0 10px;
        background: #fff;
        cursor: pointer;

        .iconfont {
            color: #000;
            font-size: 30px;
        }

        &.active {
            background: #333;

            .iconfont {
                color: #fff;
            }
        }
    }
}
.video-info-hd {
    display: flex;
    padding: 20px 0;

    .info-name {
        padding-right: 20px;
        font-size: 24px;
        line-height: 24px;
    }
    .song-author {
        line-height: 24px;
        color: #666;
    }
    .video-info-count {
        flex: 1;
        text-align: right;

        span {
            display: inline-block;
            padding-left: 20px;
            line-height: 24px;
            color: #999;
        }
    }
}
.video-desc {
    line-height: 20px;
    color: #999;
}
.video-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    margin-top: -20px;

    .video-main {
        flex: 1;
    }

    .video-aside {
        width: 300px;
        padding: 40px 0 0 20px;
    }
}
.aside-title {
    position: relative;
    font-size: 16px;
    line-height: 24px;

    &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 18px;
        margin: 3px 5px 0 0;
        border-radius: 2px;
        background: @color-theme;
        vertical-align: top;
    }
}

.item {
    flex: 30%;
    margin: 20px 10px 0;
    border-radius: 4px;

    &:hover {
        .el-image {
            transform: scale(1.1);
        }

        .icon-play {
            opacity: 1;
            transform: scale(1);
        }
    }

    .faceImg {
        display: block;
        position: relative;
        width: 100%;
        height: 123px;
        overflow: hidden;

    }

    .icon-play {
        position: absolute;
        top: 50%;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 3;
        margin-top: -30px;
        font-size: 60px;
        text-align: center;
        color: #fff;
        opacity: 0;
        transform: scale(.5);
        transition: all .4s linear;
        text-shadow: 2px 2px 10px #000;
    }

    .el-image {
        display:flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        z-index: 2;
        transition: all .4s linear;

        /deep/ img {
            height: auto;
        }
    }

    .info {
        position: relative;
        padding: 15px 0 0;

        .video-name {
            display: block;
            font-size: 14px;
        }

        .video-author, .video-playCount, .video-time {
            display: block;
            line-height: 24px;
            font-size: 14px;
            color: #999;
        }

        .icon-video {
            font-size: 24px;
            color: #999;
            vertical-align: top;
        }
    }
}
</style>
