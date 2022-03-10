<template>
    <div
        class="progress"
        @click.stop="point"
        @mouseover="showBtn(true)"
        @mouseleave="showBtn(false)"
        ref="progress"
    >
        <div class="progress-line"></div>
        <div class="progress-bg" :style="{ width: progressWidth }">
            <div class="progress-btn" v-show="isShowBtn" @mousedown.self.stop="move()"></div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
export default {
    name: 'ProgressLine',
    props: ['progressWidth'],
    setup(props, { emit }) {
        const progress = ref(null);

        let isShowBtn = ref(false);
        const showBtn = (show) => {
            let timer = null;
            return (function () {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    isShowBtn.value = show ? true : false;
                }, 300)
            })()
        }

        // 进度条拖拽
        const move = () => {
            document.onmousemove = (e) => {
                setProgressLine(e, false);
            }

            // 拖拽进度条的时候 禁止页面文字选中
            document.body.onselectstart = function () { return false }

            document.onmouseup = function (e) {
                // 拖拽结束时候 设置当前音频时间
                setProgressLine(e);
                document.onmousemove = document.onmouseup = document.body.onselectstart = null
            }

            return false
        }

        // 点击音频进度条
        const point = (e) => {
            setProgressLine(e)
        }

        const setProgressLine = (e, flag = true) => {
            const $progress = progress.value;
            //  实时获取鼠标横坐标，若是超过进度条最大宽度，则值为进度条的宽度
            const curProgress = e.clientX - getOffsetLeft($progress) >= $progress.offsetWidth ? $progress.offsetWidth : (e.clientX - getOffsetLeft($progress) <= 0 ? 0 : e.clientX - getOffsetLeft($progress))

            emit('setProgressLine', { val: curProgress / $progress.offsetWidth, flag: flag })
        }

        // 获取元素到浏览器左侧距离
        const getOffsetLeft = (obj) => {
            let oLeft = obj.offsetLeft
            let oParent = obj.offsetParent

            while (oParent !== null) {
                oLeft += oParent.offsetLeft
                oParent = oParent.offsetParent
            }

            return oLeft
        };

        return {
            progress,
            move,
            point,
            isShowBtn,
            showBtn
        }
    }
}
</script>
<style scoped lang="less">
.progress {
    position: relative;
    width: 100%;
    height: 4px;
    padding: 4px 0;
    border-radius: 2px;
    // cursor: pointer;

    .progress-line {
        position: absolute;
        top: 4px;
        left: 0;
        width: 100%;
        height: 4px;
        border-radius: 2px;
        background: #eee;
        box-shadow: 0 0 4px #efefef inset;
    }

    .progress-bg {
        position: absolute;
        top: 4px;
        left: 0;
        width: 0;
        height: 4px;
        border-radius: 2px;
        background: @color-theme;
    }

    .progress-btn {
        position: absolute;
        right: -6px;
        width: 4px;
        height: 4px;
        border: 4px solid @color-theme;
        top: -4.5px;
        background: #fff;
        box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
        transition: all 0.3s;
        border-radius: 50%;
        cursor: pointer;
    }
}
</style>
