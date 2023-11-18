<template>
  <section id="timeline">
    <div class="bg-black text-white rounded-t-full flex flex-col text-center w-full mb-20 p-10">
      <h2 class="text-5xl font-bold">Timeline</h2>
      <p class="lg:w-2/3 mx-auto leading-relaxed py-8">
        Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke
        farm-to-table. Franzen you probably haven't heard of them.
      </p>
    </div>
    <div class="container px-5 mx-auto">
      <ul
        class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical max-w-4xl m-auto"
      >
        <TimelineItem
          v-for="(item, index) in timeline"
          :item="item"
          :active="index <= 1"
          :position="index % 2 ? 'end' : 'start'"
        />
      </ul>
    </div>
  </section>
</template>
<script setup lang="ts">
import TimelineItem from '@/components/TimelineItem.vue'

const timeline = [
  {
    date: '2022/2023',
    title: 'Build Celebrity Fanalyzer',
    description:
      'Celebrity Fanalyzer is an iteration engine: give us your feedback! We try to release a new version every month. We are particularly interested in how to tweak contributor compensation for participating.'
  },
  {
    date: '2023/2024',
    title: 'Build Layer 8',
    description:
      'Ultimately, our goal is to launch Celebrity Fanalyzer behind a custom built anonymizing end-to-end encryption proxy scheduled for development in late 2023 that we call “Layer 8.” To see Layer8 in action, you can explore the exposed global object here through the developer console.'
  },
  {
    date: '2024',
    title: 'Make it a DAPP',
    description:
      'Celebrity Fanalyzer is one of many projects exploring how cryptocurrency can be used. Our goal is to make Celebrity Fanalyzer a DAPP (a Distributed APPlication) by connecting it to a blockchain. Anyone with a crypto wallet should be able to participate in our competitions, give their opinion, and get paid if they contribute meaningfully.'
  },
  {
    date: '2024',
    title: 'Connect Celebrity Fanalyzer to Layer8',
    description:
      "How to determine the definition of 'better' when opinions are subjective by definition? The simplest way is to implement a centralized process but this, of course, means only a single perspective is represented. A decentralized process model is necessary and this is a hard problem. Once Layer 8 is deployed, Celebrity Fanalyzer will have vast amounts of anonymous data to analyze freely. How to rank (and reward) authors who contribute the 'best' work? The answer is to-be-determined. Give us your thoughts! Give us your feedback!"
  },
  {
    date: '2025',
    title: 'Launch Globe and Citizen',
    description:
      'Deep fakes, fake media, toxic hate speech, and social media manipulation: this is the reality of the internet today. How to decentralize control of the media we consume but still provide a quality online service on par with a centralized one? Once Layer 8 is established, the AI ranking algorithm is open sourced, and Celebrity Fanalyzer is a successful DAPP, it’s finally time to launch Globe & Citizen — our answer to this question. Reach out to us if you’re interested in getting involved!'
  }
]
</script>