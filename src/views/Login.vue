<template>
  <auth-layout>
    <v-form
      ref="form"
      v-model="valid"
      class="px-6"
      @submit.prevent="userLogin"
    >
      <v-row
        align="center"
        justify="center"
        no-gutters
      >
        <v-col
          cols="9"
          :style="{ textAlign: 'center' }"
        >
          <v-img
            contain
            :max-width="250"
            :src="require('@/assets/logo.png')"
            :style="{ display: 'inline-flex' }"
          />
        </v-col>
      </v-row>
      <div class="pa-4" />
      <v-text-field
        v-model.trim="email"
        autofocus
        outlined
        prepend-icon="mdi-account"
        suffix="@test.com"
        label="Логин"
        placeholder=""
        :hint="!email ? 'Введите ваш рабочий email' : ''"
        :rules="emailRules"
        :disabled="processing"
      />
      <div class="py-2">
        <v-text-field
          v-model.trim="pass"
          outlined
          label="Пароль"
          prepend-icon="mdi-lastpass"
          :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
          :hint="!pass ? 'Введите ваш пароль доступа' : ''"
          :counter="!!pass && pass.length < passMinLength"
          :rules="passRules"
          :type="showPass ? 'text' : 'password'"
          @click:append="showPass = !showPass"
        />
      </div>
      <div class="pl-8">
        <v-btn
          large
          block
          tile
          color="indigo"
          type="submit"
          :dark="valid"
          :disabled="!valid"
          :loading="processing"
        >
          Войти
        </v-btn>
      </div>
    </v-form>

    <v-bottom-sheet
      :value="!!loginError"
      persistent
    >
      <v-sheet
        class="text-center"
        tile
      >
        <v-alert
          type="error"
          tile
          class="title"
        >
          Ошибка авторизации!
        </v-alert>
        <div class="py-3 px-3">
          {{ loginError }}
        </div>
        <v-btn
          class="my-4"
          color="error"
          @click="loginError = ''"
        >
          закрыть
        </v-btn>
      </v-sheet>
    </v-bottom-sheet>
  </auth-layout>
</template>

<script>
import { mapActions } from "vuex";
import AuthLayout from "@/layouts/Auth";

const emailMinLength = 5;
const passMinLength = 8;

export default {
  name: "views_Login",
  components: {
    AuthLayout
  },

  data: () => ({
    valid: false,
    email: "",
    emailMinLength,
    emailRules: [
      v => !!v || "Введите ваш рабочий e-mail",
      v =>
        (v && v.length >= emailMinLength) ||
        `Значение e-mail от ${emailMinLength} символов`
    ],
    pass: "",
    passMinLength,
    passRules: [
      v => !!v || "Введите ваш пароль доступа",
      v =>
        (v && v.length >= passMinLength) ||
        `Значение пароля от ${passMinLength} символов`
    ],
    showPass: false,
    processing: false,
    showLoginError: false,
    loginError: ""
  }),

  methods: {
    ...mapActions(["login"]),
    userLogin() {
      if (this.$refs.form.validate()) {
        this.processing = true;
        this.login({ email: `${this.email}@mail.ru`, pass: this.pass })
          .catch(err => {
            this.loginError = err;
            this.showLoginError = true;
          })
          .finally(() => {
            this.processing = false;
          });
      }
    }
  }
};
</script>
