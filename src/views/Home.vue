<template>
  <div class="home">
    <section class="player" :class="isPc ? 'pc' : 'mobile'">
      <VideoPlayer
        src="http://ivi.bupt.edu.cn/hls/cctv2hd.m3u8"
      />
    </section>
  </div>
</template>

<script>
import { isPC } from '@/utils/util'
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer'
export default {
  name: "Home",

  components: {
    VideoPlayer
  },

  data(){
    return {
      isPc: isPC(),
    }
  }

};
</script>
<style lang="scss" scoped>
.home{
  .player{
    &.pc{
      height: 500px;
      width: 870px;
    }

    &.mobile{
      width: 100%;
      height: 5.88rem;
    }
  }
}
</style>
