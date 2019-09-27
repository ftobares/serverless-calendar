<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Demo Snoop </span>
        <span class="font-weight-light">Serverless</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://snoop-serverless-demo.s3.amazonaws.com/Architecture.png"
        target="_blank"
      >
        <span class="mr-2">Ver Arquitectura</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <Calendario />
    </v-content>    
  </v-app>
</template>

<script>
import Calendario from './components/Calendario';

export default {
  name: 'App',
  components: {
    Calendario,
  },
  data: () => ({
    //
  }),
};
</script>