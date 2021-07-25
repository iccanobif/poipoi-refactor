<template>
HEH 
  <button v-on:click="sendPing()" >send ping</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { io, Socket } from "socket.io-client"
import HelloWorld from "./components/HelloWorld.vue";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

export default defineComponent({
  name: "App",
  data: () => ({
    socket: null as Socket<DefaultEventsMap, DefaultEventsMap> | null,
  }),
  methods: {
    sendPing() {

      if ("webpackHotUpdate" in window)
        this.socket = io("http://localhost:8085")
      else
        this.socket = io()

      this.socket.on("pong", () => {
        alert("pong received")
      })
      this.socket.emit("ping")  
    }
  },
  mounted() {
     
  },
  components: {
    HelloWorld,
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

function io(): number {
  throw new Error("Function not implemented.");
}
