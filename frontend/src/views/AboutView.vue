<template>
  <div class="overflow-x-clip">
    <div class="section">
      <div class="sticky top-0 h-0">
        <img id="old-man" src="/assets/art/item/1_old_man.png" alt="Image" class="item w-1/6 ml-auto">
      </div>

      <img src="/assets/art/1_young_man.png" alt="Image" style="width: 100%">
      <img src="/assets/art/2_old_man.png" alt="Image" style="width: 100%">
    </div>
    <div class="section-2">
      <div class="sticky top-0 h-0">
        <img src="/assets/art/item/2_thinking.png" alt="Image" class="item-2 w-1/4 mr-auto">
      </div>
      <img src="/assets/art/3_city.png" alt="Image" style="width: 100%">
      <img src="/assets/art/4_office.png" alt="Image" style="width: 100%">
      <img src="/assets/art/5.png" alt="Image" style="width: 100%">
    </div>
    <div class="relative mb-10">
      <div class="sticky top-0">
        <img src="/assets/art/item/3_walking_man.png" alt="Image" class="w-1/6 ml-auto">
      </div>
      <p class="w-1/4 m-auto text-6xl top-0">Here I was. Walking alone in the city. On my way to deal with another job
        while blasting funk jazz late into the night. Funk jazz had always kept me going....
      </p>

    </div>

    <img src="/assets/art/6_Summer_Sky_in_City.png" alt="Image" style="width: 100%">
    // Scroll to right the train on the bottom of this image to make the transition
    <div class="relative overflow-x-clip">
      <img src="/assets/art/item/4_train.png" alt="train" id="train" class="absolute">
    </div>
    <img id="train-trigger" src="/assets/art/7_woman.png" alt="Image" style="width: 100%">
    // Scroll to left the train on the bottom of this image to make the transition
    <img src="/assets/art/8_cars.png" alt="Image" style="width: 100%">
    <div class="relative">
      <div class="absolute bottom-0">
        <img src="/assets/art/item/5_riding.png" alt="Image" class="w-2/5 mr-auto">
      </div>
      <img src="/assets/art/9_New_Chapter_Begins.png" alt="Image" style="width: 100%">
    </div>
    <div>
      <div class="sticky top-0 h-0">
        <img src="/assets/art/item/6_falling.png" alt="Image" class="w-1/4 m-auto">
      </div>
      <img src="/assets/art/10_Road_to_utopia.png" alt="Image" style="width: 100%">
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
}
</style>
<script setup lang="ts">
import {gsap} from "gsap";
import {GSDevTools} from "gsap-trial/GSDevTools";
import {ScrollTrigger} from "gsap-trial/ScrollTrigger";
import {onMounted} from "vue";

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  gsap.registerPlugin(GSDevTools)

  gsap.from(".item", {
    scrollTrigger: {
      trigger: ".section",
      start: "top top",
      end: "150px",
      scrub: true,
      id: "first",
    },
    y: 500,
    opacity: 0,
  });
  /*gsap.from(".item-2", {
    scrollTrigger: {
      trigger: ".section-2",
      start: "80% center",
      end: "bottom top",
      markers: true,
      id: "thk",
      scrub: true,
    }, // start the animation when ".box" enters the viewport (once)
    y: 500,
    opacity: 0,
    scale: 0,
  });

  ScrollTrigger.create({
    trigger: "#thk",
    start: "bottom top",
    end: "bottom top",
    markers: true,
    id: "thk",
    scrub: true,
    // Log on action
    onEnter: () => console.log("enter!"),
    onLeave: () => console.log("leave!"),
    onEnterBack: () => console.log("enter back!"),
    onLeaveBack: () => console.log("leave back!"),
    //onUpdate: (self) => console.log("progress:", self.progress.toFixed(3), "direction:", self.direction, "velocity", self.getVelocity()),
  })
*/

  const trainTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#train-trigger",
      start: "top 150px",
      end: "bottom center",
      scrub: true,
      id: "train",
    },
  });
  trainTl.fromTo("#train", {
    xPercent: -100,
  }, {
    xPercent: 100,
  })
})
</script>