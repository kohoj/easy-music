<template>
    <el-skeleton :loading="loading" animated :count="num" :throttle="500">
        <template #template>
            <div class="item">
                <el-skeleton-item class="ske-img" variant="image" />
                <div class="ske-info">
                    <el-skeleton-item variant="h3" class="ske-name" />
                    <el-skeleton-item variant="h3" class="ske-name" style="width:50%" />
                    <el-skeleton-item variant="h5" class="ske-txt" />
                </div>
            </div>
        </template>
        <template #default>
            <div class="album">
                <router-link
                    :to="{ path: '/album', query: { id: item.id } }"
                    class="item"
                    :key="item.id"
                    v-for="item in albumList"
                >
                    <div class="faceImg">
                        <el-image :src="item.picUrl + '?param=120y120'">
                            <div slot="placeholder" class="image-slot">
                                <i class="iconfont icon-placeholder"></i>
                            </div>
                        </el-image>
                    </div>
                    <div class="info">
                        <div class="album-type">{{ item.type == 'Single' ? '单曲' : '专辑' }}</div>
                        <div class="album-name" v-if="item.name">{{ item.name }}</div>
                        <div class="artist-name" v-if="item.artist">{{ item.artist.name }}</div>
                    </div>
                </router-link>
            </div>
        </template>
    </el-skeleton>
</template>
<script>
export default {
    props: {
        albumList: Array,
        num: Number,
        loading: Boolean
    },
    setup() {
    }
}
</script>
<style scoped lang="less">
.album {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left;
    padding-bottom: 40px;
    margin: 0 -10px;
    font-size: 0;

    .item {
        display: flex;
        flex: 30%;
        max-width: calc(100% / 3 - 20px);
        margin: 20px 10px 0;
        border-radius: 4px;
        background: #f0f0f0;

        &:hover {
            .album-name {
                color: @color-theme;
            }
        }
    }

    .faceImg {
        display: block;
        position: relative;
        width: 120px;
        height: 120px;

        &::after {
            display: inline-block;
            content: "";
            position: absolute;
            top: 0;
            right: -20px;
            width: 100%;
            height: 100%;
            background: url("@assets/img/disc.png") no-repeat;
            background-size: contain;
            transition: all 0.4s linear;
        }

        &:hover {
            &::after {
                right: -30px;
                transform: rotate(90deg);
            }
        }
    }

    .el-image {
        border-radius: 4px;
        z-index: 2;
    }

    .info {
        position: relative;
        flex: 1;
        margin-left: 40px;
        overflow: hidden;

        .album-name {
            padding: 30px 15px 10px 0;
            font-size: 16px;
            color: #333;
            word-break: break-all;
        }

        .artist-name {
            font-size: 14px;
            color: #999;
        }

        .album-type {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 0px;
            width: 18px;
            line-height: 24px;
            font-size: 8px;
            word-break: break-all;
            text-align: center;
            color: #fff;
            background-color: @color-theme;
        }
    }
}

.el-skeleton {
    display: flex;
    width: auto;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left;
    padding-bottom: 40px;
    margin: 0 -10px;
    font-size: 0;

    .item {
        display: flex;
        flex: 30%;
        max-width: calc(100% / 3 - 20px);
        margin: 20px 10px 0;
    }

    .ske-img {
        display: block;
        position: relative;
        width: 120px;
        height: 120px;
        line-height: 150px;
        text-align: center;
    }

    .ske-info {
        position: relative;
        flex: 1;
        margin: 20px 0 0 40px;
        overflow: hidden;
    }

    .ske-name {
        margin: 5px 0;
    }

    .ske-txt {
        display: block;
        margin-top: 10px;
        width: 10%;
    }
}
</style>
