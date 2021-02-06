<template>
  <div class="home" :class="isPc ? 'pc' : 'mobile'">
    <section class="player">
      <VideoPlayer
        :src="videoUrl"
        :controls="[ 'play', 'volume', 'fullscreen']"
      />
    </section>
    <section class="icon">
      <img class="tv" src="../assets/tv.png" alt="tv">
      <img class="tv-control" src="../assets/control (2).png" alt="tv-control" @click="controlVisible = true;">
    </section>

    <el-drawer
      direction="btt"
      :show-close="false"
      :with-header="false"
      :visible.sync="controlVisible"
    >
      <section class="control-wrap" :class="isPc ? 'pc' : 'mobile'">
        <div 
          class="control-item" 
          :class="{active: item.link === videoUrl}"
          v-for="item in tvLink" 
          :key="item.label" 
          @click="onChange(item)"
        >
          {{item.label}}
        </div>
      </section>
    </el-drawer>
  </div>
</template>

<script>
import { isPC } from '@/utils/util'
import tvLink from '@/dosc/tv'
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer'
export default {
  name: "Home",

  components: {
    VideoPlayer
  },

  data(){
    return {
      isPc: isPC(),
      videoUrl: '',
      tvLink: tvLink,
      controlVisible: false,
    }
  },

  methods: {
    onChange(tv){
      if(tv.link === this.videoUrl){
        return
      }
      this.videoUrl = tv.link;
      document.title = tv.label;
    }
  }

};
</script>
<style lang="scss" scoped>
.home{
  &.pc{
    width: 100%;
    height: 100vh;
    overflow: hidden;
    // background: url('../assets/bg.jpg') no-repeat;
    background-size: 100% auto;
    .player{
      width: 870px;
      height: 500px;
      margin: 40px auto 0 auto;
      // height: 33.4%;
      // width: 41.7%;
      // position: absolute;
      // left: 29%;
      // top: 26.5%;
    }
    .icon{
      // display: none;
      text-align: center;
      padding-top: 32px;
      .tv{
        width: 200px;
        height: auto;
      }
      .tv-control{
          width: 50px;
          height: auto;
          cursor: pointer;
      }
    }
  }

  &.mobile{
    .player{
      width: 100%;
      height: 5.88rem;
    }
    .icon{
      text-align: center;
      padding-top: .5rem;
      .tv{
        width: 30%;
        height: auto;
      }
      .tv-control{
          display: block;
          width: 1.5rem;
          height: auto;
          margin: .4rem auto;
          cursor: pointer;
          transform: translateX(8%);
      }
    }
  }
}
.control-wrap{
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  &.pc{
    .control-item{
      font-size: 18px;
      cursor: pointer;
    }
  }
  .control-item{
    width: 33%;
    height: 33%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .36rem;
    color: #413f3f;
    box-sizing: border-box;
    &:active{
      border: 5px inset;
      background: #f7f7f7;
    }
    &.active{
      border: 5px inset;
      background: #e4e3e3;
    }
  }
}
</style>
