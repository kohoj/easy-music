<template>
    <div class="play-bar" v-if="curSongInfo">
        <!-- 播放进度条 -->
        <progress-line
            class="audioProgress"
            :progressWidth="audioProgressWidth"
            @setProgressLine="setAudioProgress"
        ></progress-line>
        <div class="w1200">
            <audio
                ref="myAudio"
                preload="auto"
                @canplay="canplaySong"
                @playing="playSong"
                @ended="endedSong"
                @error="errorSong"
                @timeupdate="updateSongTime"
                :src="curSongInfo.url"
            ></audio>
            <el-row class="play-bar-inside">
                <el-col :span="7" class="bar-l">
                    <router-link :to="{ path: '/song', query: { id: curSongInfo.id } }">
                        <el-image :src="curSongInfo.album.picUrl" class="bar-cover-img">
                            <div slot="placeholder" class="image-slot">
                                <i class="iconfont icon-placeholder"></i>
                            </div>
                        </el-image>
                    </router-link>
                    <div class="bar-name">
                        <router-link
                            :to="{ path: '/song', query: { id: curSongInfo.id } }"
                            class="song_name"
                        >{{ curSongInfo.name }}</router-link>
                        <p>
                            <router-link
                                :to="{ path: '/singer', query: { id: author.id } }"
                                class="song_author"
                                v-for="(author, k) in curSongInfo.singer"
                                :key="author.name"
                            >{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
                        </p>
                    </div>
                    <div class="bar-time">
                        <span>{{ $utils.formatSongTime(currentTime * 1000) }}</span>
                        / {{ curSongInfo.duration }}
                    </div>
                </el-col>
                <el-col :span="9" class="bar-m">
                    <div class="bar-control">
                        <i
                            class="iconfont icon-audio-prev"
                            title="上一首"
                            @click.stop="audioHandler('prev')"
                        ></i>
                        <i :class="['iconfont', playIcon]" @click.stop="audioHandler('play')"></i>
                        <i
                            class="iconfont icon-audio-next"
                            title="下一首"
                            @click.stop="audioHandler('next')"
                        ></i>
                    </div>
                </el-col>
                <el-col :span="8" class="bar-r">
                    <div class="bar-oper">
                        <div class="volume-main">
                            <i
                                :class="['iconfont', mutedIcon]"
                                title="音量"
                                @click.stop="volumeHandler"
                            ></i>
                            <progress-line
                                class="volumeLine"
                                :progressWidth="volumeProgressWidth"
                                @setProgressLine="setvolumeProgress"
                            ></progress-line>
                        </div>
                        <i
                            class="iconfont"
                            :class="modeIcon.className"
                            :title="modeIcon.title"
                            @click.stop="changePlayMode"
                        ></i>
                        <div class="popver">
                            <div class="lyric">
                                <span class="lyric-btn" title="歌词" @click="lyricsHandle">词</span>
                            </div>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                placement="top"
                                :manual="manual"
                                v-model="isShowPlayListTips"
                            >
                                <template #content>已添加到播放列表</template>
                                <div class="playlist" @click="playlistHandle">
                                    <i class="iconfont icon-playlist" title="播放列表"></i>
                                    <div
                                        class="playlist-num"
                                    >{{ 99 > playList.length ? playList.length : '99+' }}</div>
                                </div>
                            </el-tooltip>

                            <div class="lyrics-container" v-show="lyricsVisible">
                                <h3 class="lyrics-header">
                                    <span>歌词</span>
                                    <i class="iconfont icon-closed" @click="lyricsHandle"></i>
                                </h3>
                                <lyrics :sId="curSongInfo.id" :currentTime="currentTime"></lyrics>
                            </div>
                            <div class="playlist-container" v-show="playlistVisible">
                                <h3 class="playlist-header">
                                    <span>
                                        播放列表
                                        <em>(共{{ playList.length }}首)</em>
                                    </span>
                                    <div class="delSonglist" @click="clearSonglist">
                                        <i class="iconfont icon-del" title="清空列表"></i>清空列表
                                    </div>
                                </h3>
                                <song-list
                                    :songList="playList"
                                    :isScroll="true"
                                    :height="400"
                                    :typeSize="'mini'"
                                    :isShowTips="false"
                                ></song-list>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import ProgressLine from '@components/ProgressLine.vue';
import Lyrics from '@components/Lyrics.vue';
import SongList from '@components/SongList.vue'
import { computed, nextTick, onMounted, reactive, ref, toRefs, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
    name: 'PlayBar',
    setup(props, context) {
        const store = useStore();
        const myAudio = ref(null);
        const info = reactive({
            initAudioReady: false, // 初始化音频准备
            currentTime: 0, // 音频当前时长
            totalTime: 0, // 音频总时长
            isMuted: false, // 是否禁音
            playMode: 0, // 播放模式  0循环播放、1单曲循环、2随机播放
            volumeNum: 0.5, // 音量值(0~1)
            oldVolume: 0, // 取消禁音的时候，设置保留的上一次的音量值
            lyricsVisible: false,
            playlistVisible: false,
            manual: true
        });
        let timer = null;

        onMounted(() => {
            // leaveBar();
            store.commit('SET_PLAYLIST', playList.value);
        });

        // 获取播放列表
        const playIndex = computed(() => store.getters.playIndex);
        const playList = computed(() => store.getters.playList);
        const isPlayed = computed(() => store.getters.isPlayed);
        // 添加歌曲到播放列表后，弹窗tips提示
        const isShowPlayListTips = computed(() => {
            if (store.getters.isShowPlayListTips) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    store.commit('SET_PLAYLISTTIPS', false);
                }, 2500);
            }
            return store.getters.isShowPlayListTips;
        });

        // 获取当前播放歌曲信息
        const curSongInfo = computed(() => {
            return playList.value[playIndex.value];
        });

        // 播放模式
        const modeIcon = computed(() => {
            const params = [{
                className: 'icon-loop',
                title: '循环模式'
            }, {
                className: 'icon-single-cycle',
                title: '单曲循环'
            }, {
                className: 'icon-shuffle',
                title: '随机播放'
            }]
            return params[info.playMode]
        });

        // 设置音频时长
        const audioProgressWidth = computed(() => { // 音频进度条长度
            return info['currentTime'] / info['totalTime'] * 100 + '%'
        });

        // 设置音频音量
        const volumeProgressWidth = computed(() => {
            return info['volumeNum'] / 1 * 100 + '%'
        });

        // 音量禁音及取消操作
        const volumeHandler = () => {
            const $myAudio = myAudio.value;
            info['isMuted'] = $myAudio.muted = info['isMuted'] ? 0 : 1;
            info['isMuted'] && (info['oldVolume'] = info['volumeNum']);
            info['volumeNum'] = info['isMuted'] ? 0 : info['oldVolume'];
        };

        // 播放暂停按钮
        const playIcon = computed(() => {
            return !isPlayed.value ? 'icon-audio-play' : 'icon-audio-pause'
        });

        // 是否静音
        const mutedIcon = computed(() => {
            return info['isMuted'] ? 'icon-volume-active' : 'icon-volume';
        });

        // 点击拖拽音量条，设置当前音量
        const setvolumeProgress = (params) => {
            const $myAudio = myAudio.value;
            info['volumeNum'] = params.val
            info['oldVolume'] = params.val
            $myAudio.volume = params.val
            info['isMuted'] = $myAudio.muted = params.val ? 0 : 1
        }

        // 音频播放/暂停/上一首/下一首事件
        const audioHandler = (type) => {
            if (type === 'play') {
                store.commit('SET_PLAYSTATUS', !isPlayed.value);
                store.commit('SET_PLAYINDEX', playIndex.value);
            } else {
                changeSong(type);
            }
        };

        // 手动切换歌曲
        const changeSong = (type) => { // type: prev/next  上一首/下一首
            if (playList.value.length !== 1) { // 若播放列表只有一首歌则单曲循环
                let index = playIndex.value
                if (info.playMode === 2) { // 随机模式
                    index = Math.floor(Math.random() * playList.value.length - 1) + 1
                } else {
                    if (type === 'prev') {
                        index = index === 0 ? playList.value.length - 1 : --index
                    } else {
                        index = index >= playList.value.length - 1 ? 0 : ++index
                    }
                }

                info['initAudioReady'] = false;
                store.commit('SET_PLAYSTATUS', false);
                store.commit('SET_PLAYINDEX', index);
            } else {
                loopSong()
            }
        };

        // 解决刷新页面时候，音频准备就绪
        const canplaySong = (e) => {
            info['initAudioReady'] = true;
        };

        // 音频播放时候 初始化状态，获取音频总时长
        const playSong = (e) => {
            info['initAudioReady'] = true;
            store.commit('SET_PLAYSTATUS', true);
            info['totalTime'] = e.target.duration;
        };

        // 音频播放结束 自动播放下一首
        const endedSong = (e) => {
            if (info['playMode'] === 1) {
                loopSong()
            } else {
                changeSong('next')
            }
        };

        // 单曲循环歌曲
        const loopSong = () => {
            const $myAudio = myAudio.value;

            $myAudio.currentTime = 0;
            $myAudio.play();
            store.commit('SET_PLAYSTATUS', true);
        };

        // 点击拖拽进度条，设置当前时间
        const setAudioProgress = (params) => {
            info['initAudioReady'] = false;
            info['currentTime'] = params.val * info['totalTime'];

            // 拖拽的时候，不实时更改音频的时间
            if (params.flag) {
                const $myAudio = myAudio.value;
                $myAudio.currentTime = params.val * info['totalTime'];
            }
        };

        // 监听音频时间， 实时更新当前播放时间
        const updateSongTime = (e) => {
            if (!info.initAudioReady) {
                return
            }
            info['currentTime'] = e.target.currentTime
        };

        // 切换播放模式
        const changePlayMode = () => {
            info['playMode'] = info['playMode'] >= 2 ? 0 : info['playMode'] + 1
        };

        const playlistHandle = () => {
            info['playlistVisible'] = !info['playlistVisible'];
            info['lyricsVisible'] = false;
        };

        const popverClose = () => {
            info['lyricsVisible'] = info['playlistVisible'] = false;
        };

        const lyricsHandle = () => {
            info['lyricsVisible'] = !info['lyricsVisible'];
            info['playlistVisible'] = false
        };

        // 清空播放列表
        const clearSonglist = () => {
            store.commit('SET_PLAYSTATUS', false);
            store.commit('SET_PLAYLIST', []);
            store.commit('SET_PLAYINDEX', 0);
        };

        watch(curSongInfo, (newSong, oldSong) => {
            if (!newSong || (oldSong && newSong.id === oldSong.id)) {
                return
            }
            // 当前播放歌曲变化的时候  重置状态及当前播放的时长
            info['initAudioReady'] = false;
            info['currentTime'] = 0;

            nextTick(() => {
                const $myAudio = myAudio.value;

                if ($myAudio) {
                    $myAudio.play();
                }
            })
        });

        watch(() => isPlayed.value, (playing) => {
            // 等待音频加载成功完成后播放
            if (!info.initAudioReady) {
                return
            };

            nextTick(() => {
                const $myAudio = myAudio.value;

                if ($myAudio) {
                    playing ? $myAudio.play() : $myAudio.pause()
                }
            })
        });

        return {
            myAudio,
            ...toRefs(info),
            playList,
            isShowPlayListTips,
            curSongInfo,
            modeIcon,
            playIcon,
            mutedIcon,
            audioHandler,
            volumeHandler,
            changeSong,
            canplaySong,
            updateSongTime,
            audioProgressWidth,
            playSong,
            endedSong,
            loopSong,
            changePlayMode,
            popverClose,
            lyricsHandle,
            clearSonglist,
            playlistHandle,
            setAudioProgress,
            volumeProgressWidth,
            setvolumeProgress,
        }
    },
    components: {
        ProgressLine,
        Lyrics,
        SongList
    }
}
</script>
<style scoped lang="less">
.play-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 5;
    width: 100%;
    height: 70px;
    background: #fff;
    box-shadow: 0 5px 40px -1px rgba(2, 10, 18, 0.1);
}
.fold {
    position: absolute;
    top: -30px;
    left: 0;
    z-index: 3;
    width: 100%;
    height: 30px;

    .fold-btn {
        position: absolute;
        right: 200px;
        display: inline-block;
        width: 60px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 50px 50px 0px 0px;
        background: #fff;
        box-shadow: 0 5px 40px -1px rgba(2, 10, 18, 0.1);
        cursor: pointer;

        .active {
            color: @color-theme;
        }
    }
}
.audioProgress {
    position: absolute;
    top: -6px;
    z-index: 9;
}
.play-bar-inside {
    font-size: 0;
    line-height: 0;

    .bar-l {
        display: flex;
        padding: 10px 0;
        align-items: center;
        justify-content: center;
    }

    .bar-cover-img {
        width: 50px;
        height: 50px;
        border-radius: 4px;
        box-shadow: 0 0 15px 5px rgba(@color-theme, 0.15);
    }

    .bar-name {
        flex: 1;
        font-size: 0;
        padding: 0 10px 6px 30px;
        overflow: hidden;

        .song_name {
            display: block;
            padding-bottom: 20px;
            line-height: 12px;
            font-size: 12px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        p {
            line-height: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .song_author {
            line-height: 12px;
            font-size: 12px;
            color: #999;
        }
    }

    .icon-collect,
    .icon-collect-active {
        font-size: 24px;
        line-height: 24px;
        margin: 0 15px;
        cursor: pointer;
    }

    .bar-time {
        width: 115px;
        line-height: 50px;
        font-size: 14px;
        color: #606266;
        text-align: center;
    }

    .bar-control {
        display: flex;
        padding: 10px 0;
        line-height: 1;
        align-items: center;
        justify-content: center;

        .iconfont {
            margin: 0 20px;
            font-size: 30px;
            cursor: pointer;
            color: #666;
        }

        .icon-audio-play,
        .icon-audio-pause {
            font-size: 50px;
            font-weight: bold;
            color: @color-theme;
        }
    }

    .volumeLine {
        width: 150px;
        margin-left: 10px;
    }

    .bar-oper {
        position: relative;
        display: flex;
        font-size: 0;
        line-height: 50px;
        padding-left: 30px;
        align-items: center;
        justify-content: center;

        .iconfont {
            margin-left: 20px;
            font-size: 24px;
            cursor: pointer;
        }
    }

    .popver {
        position: relative;
    }

    .lyric {
        display: inline-block;
        padding: 26px 3px;
        margin-left: 20px;
        font-size: 18px;
        line-height: 18px;
        vertical-align: top;
        color: #999;
        cursor: pointer;
    }

    .playlist {
        position: relative;
        display: inline-block;
        line-height: 70px;
        color: #999;
        cursor: pointer;

        .playlist-num {
            position: absolute;
            top: 25%;
            left: 90%;
            font-size: 12px;
            line-height: 12px;
            color: #999;
        }
    }

    .volume-main {
        flex: 1;
        padding: 10px 0;
        display: flex;
        align-items: center;
    }
}

.playlist-header {
    display: flex;
    line-height: 40px;

    span {
        display: inline-block;
        flex: 1;
    }

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

    .delSonglist {
        font-size: 14px;
        font-weight: normal;
        cursor: pointer;
    }

    .icon-del {
        margin-right: 5px;
        font-size: 16px;
        color: #333;
    }
}
.lyrics-container {
    position: absolute;
    left: -200px;
    bottom: 75px;
    width: 400px;
    padding: 20px;
    height: 430px;
    border: 1px solid #ebeef5;
    border-radius: 4px 4px 0 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #fff;

    .lyrics-header {
        display: flex;
        padding: 0 0 24px;
        line-height: 16px;
        font-weight: 500;
        font-size: 16px;

        span {
            display: block;
            flex: 1;
        }

        .icon-closed {
            font-size: 20px;
        }
    }
}
.playlist-container {
    position: absolute;
    left: -250px;
    bottom: 75px;
    width: 500px;
    padding: 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px 4px 0 0;
    font-size: 14px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
}
</style>
