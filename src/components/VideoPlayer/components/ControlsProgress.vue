<template>
    <div class="controls-progress" :class="isPc ? 'pc' : 'mobile'">
        <span class="time">{{formatTime(curTime)}}</span>
        <input 
            type="range" 
            name="progress" 
            id="video_player_progress" 
            class="progress" 
            max="100" 
            min="0"
            :style="'background: linear-gradient(to right,#FF8F00 0%,#FF8F00 ' + ((+progress / 100 )* 100) + '%,rgba(255, 255, 255, 0.6) ' +  ((+progress / 100 )* 100) + '%, rgba(255, 255, 255, 0.6));'"
            v-model="progress" 
            @input="onChangeProgress" 
            @change="onChangeProgress" 
        >
        <span class="time">{{formatTime(duration)}}</span>
    </div>
</template>

<script>
export default {
    name: 'ControlsProgress', // 进度条

    props: {
        isPc: {
            type: Boolean,
            default: false
        },

        duration: {
            type: Number,
            default: 0
        },

        curTime: {
            type: Number,
            default: 0
        },
    },

    data(){
        return {
            progress: 0,
        }
    },

    watch: {
        curTime(t){
            this.progress = 100 * (t / this.duration)
        }
    },

    methods: {
        formatTime(t) { 
            if(t === Infinity){
                return '-- --'
            }
            let m = Math.floor(t / 60)
            m < 10 && (m = '0' + m)
            return m + ":" + (t % 60 / 100 ).toFixed(2).slice(-2)
        },

        onChangeProgress(){
            this.$emit('change-progress', +this.progress);
        },
    }

}
</script>

<style lang='scss' scoped>
.controls-progress{
    box-sizing: border-box;
}
.controls-progress.mobile{
    display: flex;
    align-items: center;

    .time{
        white-space: nowrap;
        flex-shrink: 0;
        font-size: .36rem;
        font-weight: 400;
    }
    //整体设置
    input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        margin: 0 .12rem;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.6);
    }
     //去除边框
    input[type=range]:focus {
        outline: none;
    }
    //定义滑动轨道
    input[type=range]::-webkit-slider-runnable-track {
        height: .06rem;
    }

    //定义滑块
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;               
        height: .3rem;
        width: .3rem;
        margin-top: -0.12rem;
        background: #ffffff;
        border-radius: 50%; /*外观设置为圆形*/
        cursor: pointer;
    }

}
.controls-progress.pc{
    display: flex;
    align-items: center;

    .time{
        white-space: nowrap;
        flex-shrink: 0;
        font-size: 18px;
        font-weight: 400;
    }
    //整体设置
    input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        margin: 0 12px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.6);
    }
     //去除边框
    input[type=range]:focus {
        outline: none;
    }
    //定义滑动轨道
    input[type=range]::-webkit-slider-runnable-track {
        height: 6px;
    }

    //定义滑块
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;               
        height: 18px;
        width: 18px;
        margin-top: -6px; /*使滑块超出轨道部分的偏移量相等*/
        background: #ffffff;
        border-radius: 50%; /*外观设置为圆形*/
        cursor: pointer;
    }

}
</style>