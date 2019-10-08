<template functional>
  <v-app>
    <v-row
      align="center"
      justify="center"
      color="white"
    >
      <v-col
        cols="12"
        sm="9"
        md="5"
        lg="4"
        lx="2"
      >
        <slot />
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  name: "layout_Auth"
};
</script>
