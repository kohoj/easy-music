<template>
    <div v-if="videoOptions.src" class='mv-detail'>
        <div class="mv-video">
            <div class="w1200">
                <div class="video-main">
                    <videoPlay 
                    width="100%" 
                    height="100%"
                    :poster="videoOptions.poster"
                    :src="videoOptions.src" />
                </div>
                <div class="mv-info">
                    <div class="mv-info-hd">
                        <div class="info-name">{{mvDetail.name}}</div>
                        <router-link :to="{ path: '/singer', query: { id: author.id }}" class="song-author" v-for="(author, k) in mvDetail.artists" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
                        <div class="mv-info-count">
                            <span class="info-count">播放量：{{$utils.formartNum(mvDetail.playCount)}}</span><span class="info-time">发布时间：{{mvDetail.publishTime}}</span>
                        </div>
                    </div>
                    <div class="mv-desc">
                        {{mvDetail.briefDesc ? mvDetail.briefDesc : '暂无简介'}}
                    </div>
                </div>
            </div>
        </div>
        <div class="w1200">
            <div class="mv-container">
                <div class="mv-main">
                    <comment-list :type="type" :sId="mId"></comment-list>
                </div>
                <div class="mv-aside">
                    <div class="simi-mv">
                        <h3 class="aside-title">相似MV</h3>
                        <div class="aside-main mv-main">
                            <div class="item" :key="'' + item.id + index" v-for="(item, index) in simiMv">
                                <router-link :to="{ path: '/mv', query: { id: item.id }}" class="faceImg">
                                    <i class="iconfont icon-play"></i>
                                    <el-image :src="item.cover || item.imgurl">
                                        <div slot="placeholder" class="image-slot">
                                            <i class="iconfont icon-placeholder"></i>
                                        </div>
                                    </el-image>
                                </router-link>
                                <div class="info">
                                    <router-link :to="{ path: '/mv', query: { id: item.id }}" class="mv-name">{{item.name}}</router-link>
                                    <router-link :to="{ path: '/singer', query: { id: item.artistId }}" class="mv-author" v-if="!item.publishTime">{{item.artistName}}</router-link>
                                    <div class="mv-playCount"><i class="iconfont icon-video"></i> {{$utils.formartNum(item.playCount)}}</div>
                                    <div class="mv-time" v-if="item.publishTime">发布时间：{{item.publishTime}}</div>
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
    name: 'mvDetail',
    components: {
        CommentList,
        videoPlay
    },
    setup(props) {
        const { proxy } = getCurrentInstance();
        const route = useRoute();
        const store = useStore();
        const info = reactive({
            mId: '0',
            mvDetail: {},
            type: 1, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
            videoOptions: {
                src: "", //视频源
                poster: "",
            },
            simiMv: [],
        });

        const getMvDetail = async() => {
            const { data: res } = await proxy.$http.mvDetail({ id: info.mId })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            
            info.mvDetail = res.data;
            info.videoOptions.poster = res.data.cover;
        };

        const getMvUrl = async(r) => {
            const { data: res } = await proxy.$http.mvUrl({ id: info.mId, r })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }

            info.videoOptions.src = res.data.url;
        };

        const getSimiMv = async() => {
            const { data: res } = await proxy.$http.simiMv({ id: info.mId })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            
            info.simiMv = res.mvs
        };

        const init = () => {
            getMvDetail();
            getMvUrl();
            getSimiMv()
        };

        onBeforeRouteUpdate((to) => {
            info['mId'] = to.query.id;
            init();
        });

        onMounted(() => {
            info['mId'] = route.query.id;
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
    height: 675px;
    font-size: 0;

    .mv-light {
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
.mv-info-hd {
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
    .mv-info-count {
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
.mv-desc {
    line-height: 20px;
    color: #999;
}
.mv-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    margin-top: -20px;

    .mv-main {
        flex: 1;
        padding-bottom: 100px;
        overflow: hidden;
    }

    .mv-aside {
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

        .mv-name {
            display: block;
            font-size: 14px;
        }

        .mv-author, .mv-playCount, .mv-time {
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
