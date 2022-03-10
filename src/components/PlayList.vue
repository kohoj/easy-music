<template>
    <el-skeleton
        :loading="loading"
        animated
        :count="num"
        :throttle="500"
        >
        <template #template>
            <div class="item">
                <el-skeleton-item class="ske-img" variant="image" />
                <div class="ske-info">
                    <el-skeleton-item variant="h3" class="ske-name" />
                    <el-skeleton-item variant="h3" class="ske-name" style="width:50%" />
                    <div class="ske-tags">
                        <el-skeleton-item variant="text" />
                        <el-skeleton-item variant="text" />
                        <el-skeleton-item variant="text" />
                    </div>
                </div>
            </div>
        </template>
        <template #default>
            <div class="playlist">
                <div class="item" v-for="item in playList" :key="item.id">
                    <router-link :to="{ path: '/playlist/detail', query: { id: item.id }}" class="faceImg">
                        <el-image :src="item.coverImgUrl" lazy>
                            <template #placeholder>
                                <div class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </template>
                        </el-image>
                        <span class="playCount"><i class="iconfont icon-playnum"></i><em>{{$utils.formartNum(item.playCount)}}</em> / {{item.trackCount + '首'}}</span>
                    </router-link>
                    <div class="info">
                        <router-link :to="{ path: '/playlist/detail', query: { id: item.id }}" class="info_name">{{item.name}} </router-link>
                        <div class="tags">
                            <router-link :to="{ path: '/playlist', query: { cat: tag }}" class="tag" v-for="(tag, index) in item.tags" :key="index">#{{tag}}</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </el-skeleton>
</template>
<script>
export default {
    props: {
        playList: Array,
        num: Number,
        loading: Boolean
    },
    setup(props) {
    }
};
</script>
<style lang="less" scoped>
.playlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    font-size: 0;
}
.item {
    width: 18%;
    padding: 20px 2% 30px 0;
    margin-right: -22px;

    .faceImg {
        display: block;
        position: relative;
        height: 216px;

        &::after, &::before {
            content: "";
            width: 100%;
            height: 100%;
            background-color: #d9d9d9;
            position: absolute;
            top: 0;
        }

        &::before {
            border: 1px solid #d6d6d6;
            right: -4px;
            -webkit-transform: scale(.85);
            -ms-transform: scale(.85);
            transform: scale(.85);
            -webkit-transform-origin: 100% 50%;
            -ms-transform-origin: 100% 50%;
            transform-origin: 100% 50%;
            z-index: 2;
            border-radius: 2px;
            transition: all .4s linear;
        }

        &::after {
            border: 1px solid #c4c4c4;
            right: -8px;
            -webkit-transform: scale(.73);
            -ms-transform: scale(.73);
            transform: scale(.73);
            -webkit-transform-origin: 100% 50%;
            -ms-transform-origin: 100% 50%;
            transform-origin: 100% 50%;
            z-index: 1;
            border-radius: 2px;
            opacity: .5;
            transition: all .4s linear .1s;
        }
    }

    .el-image {
        width: 100%;
        height: 100%;
        z-index: 3;
        border-radius: 4px;
    }

    .playCount {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 4;
        font-size: 12px;
        display: block;
        width: 55%;
        text-align: center;
        color: #fff;
        line-height: 30px;
        border-radius: 0 4px 0 0;
        /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#000000+0,000000+100&0+0,0.5+97 */
        background: -moz-linear-gradient(left,  rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 97%, rgba(0,0,0,0.5) 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(left,  rgba(0,0,0,0) 0%,rgba(0,0,0,0.5) 97%,rgba(0,0,0,0.5) 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to right,  rgba(0,0,0,0) 0%,rgba(0,0,0,0.5) 97%,rgba(0,0,0,0.5) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#80000000',GradientType=1 ); /* IE6-9 */

        .icon-playnum {
            color: #fff;
        }

        em {
            display: inline-block;
            padding-left: 5px;
            font-style: normal;
        }
    }

    &:hover {
        .faceImg {
            position: relative;

            &::after, &::before {
                background: #ff960080
            }

            &::before {
                right: -6px;
            }

            &::after {
                right: -12px;
            }
        }

        .info_name {
            color: #000;
        }
    }

    .info_name {
        display: block;
        font-size: 16px;
        line-height: 22px;
        margin-top: 15px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
    }

    .tags {
        padding: 5px 0;

        .tag {
            padding-right: 5px;
            font-size: 12px;
            color: @color-theme;
        }
    }
}

.el-skeleton {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    font-size: 0;

    .ske-itme {
        width: 18%;
        padding: 20px 2% 30px 0;
        margin-right: -22px;
    }

    .ske-img {
        display: block;
        position: relative;
        height: 216px;
        line-height: 250px;
        text-align: center;
    }

    .ske-info {
        padding-top: 15px;
    }

    .ske-name {
        line-height: 16px;
        margin: 3px 0;
    }

    .ske-tags {
        display: flex;
        padding: 5px 0;

        * {
            width: 10%;
            margin-right: 10px;
        }
    }
}
</style>