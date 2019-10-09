<template>
  <v-app>
    <v-navigation-drawer
      v-if="user"
      v-model="navbar"
      app
      temporary
      fixed
      dark
      src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
    >
      <template #prepend>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ userTitle }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ userEmail }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action @click="askLogout">
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
        </v-list-item>
        <v-divider />
      </template>

      <v-list :dark="false">
        <v-list-item
          v-for="item in navItems"
          :key="item.href"
          link
          :to="item.href"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template #append>
        <div class="pa-2">
          <v-btn
            block
            color="error"
            @click="askLogout"
          >
            Выйти
          </v-btn>
        </div>
      </template>

      <v-dialog
        v-model="dialogLogoutShown"
        max-width="300"
      >
        <v-card>
          <v-card-title>
            <span :style="{ 'word-break': 'normal' }">Вы действительно хотите выйти?</span>
          </v-card-title>
          <v-card-actions>
            <v-btn
              text
              large
              @click="dialogLogoutShown = false"
            >
              Нет
            </v-btn>
            <div class="flex-grow-1" />
            <v-btn
              color="primary"
              @click="userLogout"
            >
              Да, выйти
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-navigation-drawer>
    <slot name="toolbar">
      <v-app-bar
        app
        color="indigo"
        dark
      >
        <v-btn
          v-if="user"
          icon
          @click.stop="navbar = !navbar"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title class="headline">
          <slot name="toolbarTitle">
            Vuetify + Firebase
          </slot>
        </v-toolbar-title>
      </v-app-bar>
    </slot>

    <v-content>
      <v-container
        fluid
        color="white"
      >
        <v-row
          v-if="!storeConnected"
          align="center"
          justify="center"
        >
          <v-progress-circular
            :size="70"
            :width="7"
            color="info"
            indeterminate
          />
        </v-row>
        <slot v-else />
      </v-container>
    </v-content>

    <v-bottom-sheet
      :value="!!errorLogout"
      persistent
    >
      <v-sheet class="text-center">
        <div class="title pt-6">
          Ошибка деавторизации!
        </div>
        <div class="py-3 px-3">
          {{ errorLogout }}
        </div>
        <v-btn
          class="my-4"
          color="error"
          @click="errorLogout = ''"
        >
          закрыть
        </v-btn>
      </v-sheet>
    </v-bottom-sheet>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getNavList } from "@/router";

export default {
  name: "layout_Main",
  data: () => ({
    navbar: null,
    navItems: [],
    dialogLogoutShown: false,
    errorLogout: ""
  }),
  computed: {
    ...mapState(["user", "userProfile", "storeConnected"]),
    userTitle() {
      return (this.userProfile && this.userProfile.name) || "идет загрузка...";
    },
    userEmail() {
      return (this.user && this.user.email) || "";
    }
  },
  created() {
    this.navItems = getNavList();
  },
  methods: {
    ...mapActions(["logout"]),
    askLogout() {
      this.navbar = false;
      this.dialogLogoutShown = true;
    },
    userLogout() {
      this.dialogLogoutShown = false;
      this.logout().catch(err => {
        this.errorLogout = err;
      });
    }
  }
};
</script>
