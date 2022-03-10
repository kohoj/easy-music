<template>
    <el-skeleton
        :loading="loading"
        animated
        :throttle="500"
        :count="num"
        >
        <template #template>
            <div class="item">
                <div class="faceImg">
                    <el-skeleton-item class="ske-img" variant="image" />
                </div>
                <div class="info">
                    <el-skeleton-item variant="h3" class="ske-name" style="width:50%" />
                    <el-skeleton-item variant="h5" class="ske-txt" />
                </div>
            </div>
        </template>
        <template #default>
            <div class='artist'>
                <router-link :to="{ path: '/singer', query: { id: item.id }}" class="item" :key="item.id" v-for="item in artistList">
                    <div class="faceImg">
                        <el-image :src="item.picUrl + '?param=120y120'">
                            <div slot="placeholder" class="image-slot">
                                <i class="iconfont icon-placeholder"></i>
                            </div>
                        </el-image>
                    </div>
                    <div class="info">
                        <div class="name">{{item.name}}</div>
                        <div class="albumSize">专辑：{{item.albumSize}}</div>
                    </div>
                </router-link>
            </div>
        </template>
    </el-skeleton>
</template>
<script>
export default {
    props: {
        artistList: Array,
        num: Number,
        loading: Boolean
    },
    setup() {
    }
}
</script>
<style lang="less" scoped>
.artist {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 40px;

    .item {
        width: 120px;
        margin: 0 40px 40px;

        .el-image {
            transition: all .4s linear;
        }

        &:hover {
            .el-image {
                transform: rotateY(180deg);
            }
        }
    }

    .faceImg {
        width: 120px;
        height: 120px;
        border-radius: 100%;
        overflow: hidden;
    }

    .info {
        text-align: center;

        .name {
            line-height: 28px;
            font-size: 14px;
        }

        .ske-txt {
            color: #999;
        }
    }
}

.el-skeleton {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 40px;

    .item {
        width: 120px;
        margin: 0 40px 40px;
    }

    .ske-img {
        width: 120px;
        height: 120px;
        border-radius: 100%;
        overflow: hidden;
    }

    .info {
        text-align: center;

        .ske-name {
            line-height: 28px;
            font-size: 14px;
            margin: 5px 0;
        }

        .albumSize {
            color: #999;
        }
    }
}
</style>