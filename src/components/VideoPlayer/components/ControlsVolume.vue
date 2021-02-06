<template>
    <div class="controls-volume">
        <el-popover
            placement="top"
            v-model="volumePopoverVisible"
            trigger="manual"
            popper-class="volume-popover"
            :visible-arrow="false"
            :open-delay="0"
        >
            <span 
                class="volume-btn" 
                slot="reference"
                @mouseenter="onMouseEnter"
                @mouseleave="onMouseLeave"
                @click.stop="onClickVolumeIcon" 
            >
                <i v-show="value > 0" class="iconfont icon-bofangtubiao-02"></i>
                <i v-show="value === 0" class="iconfont icon-bofangtubiao-03"></i>
            </span>
            <section 
                class="volume-popover-content"
                @mouseenter="onMouseEnter"
                @mouseleave="onMouseLeave"
            >
                <div class="value">{{value}}</div>
                <el-slider
                    class="slider"
                    v-model="value"
                    vertical
                    height="90px"
                    :show-tooltip="false"
                    @input="onChangeVolume"
                    @change="recordVolume"
                >
                </el-slider>
        </section>
        </el-popover>
    </div>
</template>

<script>
export default {
    name: 'ControlsVolume', // 音量控制

    data(){
        return {
            value: 80,
            preVolume: 0,
            volumePopoverVisible: false,
            volumePopoverVisibleTimer: null,
        }
    },

    mounted(){
        let volume = localStorage.getItem('xdh_video_volume');
        if(volume){
            this.value = +volume;
        }
        this.onChangeVolume(this.value);
    },

    methods: {
        onChangeVolume(volume){
            volume = +(volume / 100).toFixed(2);
            this.$emit('change-volume', volume);
        },

        // 记录音量值
        recordVolume(volume){
            localStorage.setItem('xdh_video_volume', volume);
        },

        // 当点击音量图标时,置为静音或者恢复音量
        onClickVolumeIcon(){
            if(this.value > 0){
                this.preVolume = this.value;
                this.value = 0;
                this.onChangeVolume(this.value);
            }else{
                this.value = this.preVolume || 80;
                this.onChangeVolume(this.value);
            }
        },

        onMouseEnter(){
            if(this.volumePopoverVisibleTimer) clearTimeout(this.volumePopoverVisibleTimer);
            this.volumePopoverVisible = true;
            this.$emit('lock');
        },

        onMouseLeave(){
            this.volumePopoverVisibleTimer = setTimeout(() => {
                this.volumePopoverVisible = false;
            }, 200)
            this.$emit('unlock');
        },

    }
}
</script>
<style lang="scss">
.el-popover.volume-popover{
    padding: 0px; 
    border: none;
    background-color: rgba(56, 56, 56, 0.6);
    width: 48px;
    min-width: 0px;
    transform: translateY(-30px);
}
</style>
<style lang='scss' scoped>
.controls-volume{
    position: relative;
    .volume-btn{
        outline: none;
        i{
            font-size: 22px;
            cursor: pointer;
        }
    }

}
.volume-popover-content{
    padding: 8px 5px 18px 5px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .value{
        font-size: 14px;
        margin-bottom: 6px;
        text-align: center;
        color: #ffffff;
    }
    .slider.el-slider {
        ::v-deep .el-slider__runway{
            background-color: rgba(255, 255, 255, 0.3);
        }
        ::v-deep .el-slider__bar{
            background-color: #FF8F00;
        }
        ::v-deep .el-slider__button-wrapper .el-slider__button{
            border: none;
            width: 12px;
            height: 12px;
        }
    }
}

</style>