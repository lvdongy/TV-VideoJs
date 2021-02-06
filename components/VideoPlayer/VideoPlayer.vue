<template>
    <div 
        class="video-player"
        :class="[{'full-screen': isFullScreen}, isPc ? 'video-player-pc' : 'video-player-mobile']" 
        @mousemove="onMovePlayer"
        @mouseleave="onLeavePlayer"
    >
        <video 
            id="videoPlayer"
            ref="videoPlayer" 
            class="video-js vjs-big-play-centered"
            playsinline="true" 
            x-webkit-airplay="true"  
            webkit-playsinline="true"
            x5-video-player-type="h5"
        >
            <!-- <source src="@assets/video-demo2.mp4" type="video/mp4" /> -->
            <!-- <source src="@assets/demo.mp4" type="video/mp4" /> -->
            <!-- <source src="http://vjs.zencdn.net/v/oceans.mp4" type="video/mp4" /> -->
            <!-- <source src="http://ivi.bupt.edu.cn/hls/cctv2hd.m3u8"/> -->
            <p class="vjs-no-js">
                播放视频失败, 请升级您的浏览器
            </p>
        </video>

        <!-- 这里为了盖在video.js自身层上,用来点击触发事件 -->
        <div  class="video-player-mask" @click.stop="onClickPlayer"></div>

         <!-- 全屏下顶部条 -->
        <transition name="show">
            <section class="header-mobile" v-if="isFullScreen" v-show="isLock ? false : isShowControls">
                <i v-if="!isPc" class="iconfont icon-bofangtubiao-11" @click.stop="onClickFullScreen"></i>
                <div class="title">{{videoTitle}}</div>
            </section>
        </transition>

        <!-- 屏幕中间开关按钮 -->
        <transition name="show">
            <div class="play-btn" v-if="playStatus === 'pause'" @click.stop="onClickPlay">
                <template v-if="isPc">
                    <i v-show="playStatus === 'pause'" class="iconfont icon-bofangtubiao-01"></i>
                    <i v-show="playStatus === 'play'" class="iconfont icon-bofangtubiao-06"></i>
                </template>
                <i v-else v-show="playStatus === 'pause'" class="iconfont icon-mobile icon-bofangtubiao-13"></i>
            </div>
        </transition>

        <!-- 锁 -->
        <transition name="show">
            <div 
                class="lock-btn" 
                v-show="isFullScreen && isShowControls"
                @click.stop="isLock = !isLock"
            >
                <i v-show="!isLock" class="iconfont icon-bofangtubiao-07"></i>
                <i v-show="isLock" class="iconfont icon-bofangtubiao-08"></i>
            </div>
        </transition>

        <!-- 截屏 -->
        <transition name="show">
            <div 
                class="screen-btn" 
                v-show="isLock ? false : (isFullScreen && isShowControls)"
                @click.stop="onClickScreenshot"
            >
                <i class="iconfont icon-bofangtubiao-09-copy"></i>
            </div>
        </transition>

        <!-- 底部控制项 -->
        <transition name="show">
            <section 
                v-show="isLock ? false : isShowControls"
                class="controls" 
                :class="{'controls-full-screen': isFullScreen}" 
                @mouseenter="isLockShowControls = true;"
                @mouseleave="isLockShowControls = false;"
                @click.stop
            >
                <!-- 进度条控制 -->
                <ControlsProgress 
                    v-if="controls.includes('progress')"
                    class="progress"
                    :is-pc="isPc"
                    :duration="duration"
                    :cur-time="curTime"
                    @change-progress="onChangeProgress"
                />
                <!-- 刷新按钮 -->
                <div v-if="controls.includes('refresh')" class="controls-item refresh" @click.stop="onClickRefresh">
                    <i class="iconfont icon-bofangtubiao13-13"></i>
                </div>
                <!-- 播放按钮 -->
                <div v-if="controls.includes('play')" class="controls-item play" @click.stop="onClickPlay">
                    <i v-show="playStatus === 'pause'" class="iconfont icon-bofangtubiao-01"></i>
                    <i v-show="playStatus === 'play'" class="iconfont icon-bofangtubiao-06"></i>
                </div>
                <!-- 倍数控制 -->
                <ControlsSpeed 
                    v-if="controls.includes('speed')"
                    v-show="isPc || isFullScreen"
                    class="controls-item speed" 
                    :is-pc="isPc" 
                    @change-speed="onChangeSpeed"
                    @lock="handleLockControls"
                    @unlock="handleUnlockControls"
                />
                <!-- 音量控制 -->
                <ControlsVolume 
                    ref="controlsVolume"
                    v-if="controls.includes('volume')"
                    v-show="isPc"
                    class="controls-item volume" 
                    @change-volume="onChangeVolume"
                    @lock="handleLockControls"
                    @unlock="handleUnlockControls"
                />
                <!-- 全屏控制 -->
                <div v-if="controls.includes('fullscreen')" class="controls-item fullscreen" @click.stop="onClickFullScreen">
                    <i class="iconfont" :class="isFullScreen ? 'icon-bofangtubiao5-05' : 'icon-bofangtubiao-04'"></i>
                </div>
            </section>
        </transition>
        <!-- <button @click="demo">demo</button>
        <video 
            id="videoPlayerDemo"
            src="@/assets/demo.mp4"
            controls
        ></video> -->
    </div>
</template>

<script>
import Video from 'video.js'
import 'video.js/dist/video-js.css'
import ControlsVolume from './components/ControlsVolume'
import ControlsSpeed from './components/ControlsSpeed'
import ControlsProgress from './components/ControlsProgress'
import { isPC } from '@utils/util'
export default {
    name: 'VideoPlayer',

    props: {
        // ['refresh', 'play', 'progress', 'speed', 'volume', 'fullscreen',]
        controls: {
            type: Array,
            default: () => {
                return [ 'play', 'progress', 'speed', 'volume', 'fullscreen'] 
            }
        },

        src: {
            type: String,
            default: ''
        },

        videoTitle: {
            type: String,
            default: '测试标题'
        },

    },

    components: {
        ControlsVolume,
        ControlsSpeed,
        ControlsProgress
    },

    data(){
        return {
            video: null,
            playStatus: 'pause',
            curTime: 0,
            duration: 0,

            isLock: false,
            isFullScreen: false,
            isPc: isPC(),
            isShowControls: false,
            isLockShowControls: false,
            hiddenControlsTimer: null,
        }
    },

    watch: {
        // 赋值视频链接
        src: {
            handler(src){
                if(!src){
                    return
                }
                if(this.video){
                    this.video.src({src})
                }else{
                    setTimeout(() => {
                        this.video.src({src})
                    })
                }
            },
            immediate: true,
        },
    },

    mounted(){
        this.init();
    },

    destroyed(){
        document.removeEventListener('fullscreenchange', this.handleChangeFullScreen);
    },

    methods: {
        // demo(){
        //     // let video = document.querySelector('#videoPlayer > video');
        //     let video = document.querySelector('#videoPlayerDemo');
        //     video.useCORS = true; // 解决跨域
        //     video.crossOrigin = 'Anonymous'; // 这两个参数必填 解决跨域
        //     let canvas = document.createElement('canvas');
        //     canvas.style.width = '1000px';
        //     canvas.style.height = '1000px';
        //     let ctx = canvas.getContext('2d');
        //     ctx.drawImage(video, 0, 0);
        //     document.body.appendChild(canvas);
        //     let url = canvas.toDataURL("image/png");
        //     let img = document.createElement('img');
        //     img.src = url;
        //     document.body.appendChild(img);
        // },
        init(){
            this.video = Video(this.$refs.videoPlayer, {
                controls: false, 
                controlBar: false,
                preload: "auto", //自动加载 
                notSupportedMessage: '此视频暂无法播放，请稍后再试',
            }, () => {
                // 视频数据加载完成后触发
                this.video.on('loadedmetadata', () => {
                    this.duration = this.video.duration();
                })
                // 视频播放过程中触发
                this.video.on('timeupdate', () => {
                    this.curTime = this.video.currentTime();
                })
                // 视频加载中
                // this.video.on('waiting', () => {
                //     // ...
                // })
                this.video.on('ended', () => {
                    this.video.load();
                    this.video.pause();
                })
                // 视频播放
                this.video.on('play', () => {
                    this.playStatus = 'play'
                    this.$emit('play');          
                });
                this.video.on('pause', () => {
                    this.playStatus = 'pause';
                    this.$emit('pause'); 
                });
                // 监听关闭全屏时,恢复视频样式
                document.addEventListener('fullscreenchange', this.handleChangeFullScreen);
            })
        },

        onClickRefresh(){
        //    window.location.reload();
            this.video.src({src: this.src});
            this.video.pause();
        },

        onClickPlay(){
            if(this.playStatus === 'pause'){
                this.video.play();
            }else{
                this.video.pause();
            }
        },

        onChangeProgress(val){
            this.curTime = this.duration * (val / 100);
            this.video.currentTime(this.curTime);
            // 操作的过程中防止操作栏突然消失
            if(this.hiddenControlsTimer) clearTimeout(this.hiddenControlsTimer);
            this.hiddenControlsTimer = setTimeout(() => {
                this.isShowControls = false;
            }, 2500)
        },

        onChangeVolume(val){
            if(this.video){
                this.video.volume(val);
                return
            }
            this.$nextTick(() => {
                this.video.volume(val);
            })
        },

        onChangeSpeed(val){
            this.video.playbackRate(val);
        },

        onClickFullScreen(){
            if (!document.fullscreenElement) {
                let ele = document.documentElement;
                if (ele.requestFullscreen) {
                    ele.requestFullscreen()
                } else if (ele.mozRequestFullScreen) {
                    ele.mozRequestFullScreen()
                } else if (ele.webkitRequestFullScreen) {
                    ele.webkitRequestFullScreen()
                }else{
                    this.video.requestFullscreen(); // TODO:效果不太理想
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
            
        },

        // 截屏
        onClickScreenshot(){
            console.log('onClickScreenshot');
            // const el = document.getElementById(`video-player`);
            // const height = window
            //         .getComputedStyle(el)
            //         .getPropertyValue('height')
            //         .replace('px', ''),
            //     width = window
            //         .getComputedStyle(el)
            //         .getPropertyValue('width')
            //         .replace('px', '');
            // dom2image
            //     .toPng(el, {
            //         bgcolor: 'white',
            //         width,
            //         height,
            //         scale: 2,
            //         quality: 1
            //     })
            //     .then(dataUrl => {
            //         const link = document.createElement('a');
            //         link.download = 'question.png';
            //         link.href = dataUrl;
            //         link.click();
            //     });
        },

        handleChangeFullScreen(){
            console.log('change full');
            if (!document.fullscreenElement) {
                // 退出全屏操作
                this.isFullScreen = false;
                this.isLock = false;
            }else{
                // 进入全屏操作
                this.isFullScreen = true;
            }
        },

        onMovePlayer(){
            if(!this.isPc){
                return
            }
            this.isShowControls = true;
            if(this.hiddenControlsTimer) clearTimeout(this.hiddenControlsTimer);
            if(!this.isLockShowControls){
                this.hiddenControlsTimer = setTimeout(() => {
                    this.isShowControls = false;
                }, 2500)
            }
        },

        onLeavePlayer(){
            if(!this.isPc){
                return
            }
            if(this.hiddenControlsTimer) clearTimeout(this.hiddenControlsTimer);
            this.hiddenControlsTimer = setTimeout(() => {
                this.isShowControls = false;
            }, 2500)
        },

        onClickPlayer(){
            if(this.isPc){
                return
            }
            this.isShowControls = !this.isShowControls;
            if(this.isShowControls){
                if(this.hiddenControlsTimer) clearTimeout(this.hiddenControlsTimer);
                this.hiddenControlsTimer = setTimeout(() => {
                    this.isShowControls = false;
                }, 2500)
            }
        }, 

        // 保持控制栏显示
        handleLockControls(){
            if(this.hiddenControlsTimer) clearTimeout(this.hiddenControlsTimer);
            this.isLockShowControls = true;
        },

        handleUnlockControls(){
            this.isLockShowControls = false;
        },

    }
}
</script>

<style lang='scss' scoped>
.video-player{
    background-color: #000000;
    position: relative;
    width: 100%;
    height: 100%;

    .video-player-mask{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    
    .controls{
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        color: #ffffff;
        padding-top: .9rem;
        box-sizing: content-box;
        background: linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
    }
    // 控制项-手机
    &.video-player-mobile{
        // width: 100%;
        // height: 5.88rem;
        .controls{
            font-size: .36rem;
            height: 1.5rem;
            box-sizing: border-box;
            // 全屏下的样式
            &.controls-full-screen{
                height: 1.5rem;
                width: 100%;
                left: 50%;
                transform: translateX(-50%);
                .refresh{
                    left: 1.2rem;
                }
                .play{
                    left: 1.2rem;
                    > i{
                        font-size: .7rem;
                    }
                }
                .progress{
                    padding: 0 2.1rem;
                }
                .speed{
                    display: inline-block;
                    right: 1.2rem;
                }
                .fullscreen{
                    display: none;
                }
            }

            // 所有icon
            &-item{
                display: inline-block;
                position: absolute;
                bottom: 50%;
                transform: translateY(50%);
                i{
                    font-size: .6rem;
                    cursor: pointer;
                }
            }
            .progress{
                position: absolute;
                width: 100%;
                padding: 0 1.4rem;
                left: 50%;
                bottom: 50%;
                transform: translate(-50%, 50%);
            }
            .refresh{
                left: .42rem;
            }
            .play{
                left: .42rem;
            }
            // .speed{
            //     display: none;
            // }
            .fullscreen{
                right: .42rem;
            }
        }
        .play-btn{
            width: 1.8rem;
            height: 1.8rem;
            border-radius: 50%;
            text-align: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
            >i{
                font-size: 1.8rem;
                color: #ffffff;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
        .header-mobile{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1.3rem;
            font-size: .44rem;
            font-weight: 800;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 0 1.2rem;
            padding-bottom: 1rem;
            box-sizing: content-box;
            background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
            >i{
                font-size: .68rem;
                margin-right: .6rem;
            }
            .title{
                white-space: nowrap;
                width: 90%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .lock-btn{
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, .3);
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            left: 0.95rem;
            transform: translateY(-50%);
            >i{
                color: #ffffff;
                font-size: .6rem;
            }
        }
        .screen-btn{
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, .3);
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            right: 0.95rem;
            transform: translateY(-50%);
            >i{
                color: #ffffff;
                font-size: .6rem;
            }
        }
    }
     // 控制项-PC
    &.video-player-pc{
        // width: 870px;
        // height: 500px;
        .controls{
            font-size: 18px;
            height: 65px;

            // 所有icon
            &-item{
                display: inline-block;
                position: absolute;
                i{
                    font-size: 22px;
                    cursor: pointer;
                }
            }
            .progress{
                position: absolute;
                width: 100%;
                padding: 0 14px;
                left: 0;
                bottom: 48px;
            }
            .refresh{
                left: 14px;
                bottom: 12px;
            }
            .play{
                left: 14px;
                bottom: 12px;
            }
            .volume{
                right: 62px;
                bottom: 12px;
            }
            .speed{
                right: 110px;
                bottom: 14px;
            }
            .fullscreen{
                right: 14px;
                bottom: 12px;
            }
        }
        .play-btn{
            width: 84px;
            height: 84px;
            border-radius: 50%;
            background: rgba(56, 56, 56, .8);
            text-align: center;
            line-height: 84px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
            >i{
                font-size: 30px;
                color: #ffffff;
            }
        }
        .header-mobile{
             position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 66px;
            font-size: 22px;
            font-weight: 800;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-left: 14px;
            padding-bottom: 16px;
            box-sizing: content-box;
            background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
            .title{
                white-space: nowrap;
                width: 90%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    // 全屏下
    &.full-screen{
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
    }

}

.show-enter{
    opacity: 0;
}
.show-enter-to{
    opacity: 1;
}
.show-leave{
    opacity: 1;
}
.show-leave-to{
    opacity: 0;
}
.show-leave-active{
    transition: opacity .3s linear;
}
.video-js{
    width: 100%;
    height: 100%;
}
::v-deep .vjs-error .vjs-error-display::before{
    display: none;
}
</style>