<template>
    <div class="controls-speed" :class="isPc ? 'pc' : 'mobile'">
        <el-popover
            placement="top"
            v-model="speedListVisible"
            trigger="manual"
            :popper-class="isPc ? 'speed-popover pc' : 'speed-popover mobile'"
            :visible-arrow="false"
            :open-delay="0"
        >
            <span 
                class="speed-btn" 
                slot="reference"
                @mouseenter="onMouseEnter"
                @mouseleave="onMouseLeave"
                @click.stop="onClickSpeedBtn"
            >{{`${(+value).toFixed(1)}X`}}</span>
            <section 
                class="speed-list" 
                :class="isPc ? 'pc' : 'mobile'"
                @mouseenter="onMouseEnter"
                @mouseleave="onMouseLeave"
            >
                <div 
                    class="speed-list-item"
                    v-for="item in speedList" 
                    :key="item.value"
                    :class="{active: item.value == value}"
                    @click.stop="onChangeSpeed(item)"
                >{{item.label}}</div>
            </section>
        </el-popover>
    </div>
</template>

<script>
export default {
    name: 'ControlsSpeed', // 播放倍数控制

    props: {
        isPc: {
            type: Boolean,
            default: false
        },
    },

    data(){
        return {
            speedList: [
                { value: 2.0, label: '2.0x' },
                { value: 1.5, label: '1.5x' },
                { value: 1.2, label: '1.2x' },
                { value: 1.0, label: '1.0x' },
            ],
            speedListVisible: false,
            speedListVisibleTimer: null,
            value: 1.0,
        }
    },

    methods: {
        onChangeSpeed(speed){
            this.value = speed.value;
            this.$emit('change-speed', this.value);
            this.speedListVisible = false;
        },

        onClickSpeedBtn(){
            // if(this.isPc){
            //     return
            // }
        },

        onMouseEnter(){
            // console.log('enter');
            if(this.speedListVisibleTimer) clearTimeout(this.speedListVisibleTimer);
            this.speedListVisible = true;
            this.$emit('lock');
        },

        onMouseLeave(){
            // console.log('leave');
            this.speedListVisibleTimer = setTimeout(() => {
                this.speedListVisible = false;
            }, 200)
            this.$emit('unlock');
        }
    }
}
</script>
<style lang="scss">
.el-popover.speed-popover.mobile{
    padding: 0px; 
    border: none;
    background-color: rgba(56, 56, 56, 0.6);
    min-width: 0px;
}
.el-popover.speed-popover.pc{
    padding: 0px; 
    border: none;
    background-color: rgba(56, 56, 56, 0.6);
    width: 60px;
    min-width: 0px;
    transform: translateY(-30px);
}
</style>
<style lang='scss' scoped>
.controls-speed.mobile{
    .speed-btn{
        white-space: nowrap;
        font-size: .36rem;
        font-weight: 400;
    }    
}
.controls-speed.pc{
    .speed-btn{
        white-space: nowrap;
        font-size: 18px;
        font-weight: 400;
    }    
}

.speed-list.mobile{
    .speed-list-item{
        font-size: .36rem;
        font-weight: 400;
        color: #FFFFFF;
        text-align: center;
        padding: .2rem .4rem;
        cursor: pointer;
        &.active{
            color: #FF8F00;
        }
    }
}
.speed-list.pc{
    .speed-list-item{
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 35px;
        text-align: center;
        cursor: pointer;
        &.active{
            color: #FF8F00;
        }
    }
}
</style>