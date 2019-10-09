import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db, auth, authErrCodes } from "./firebaseConfig.js";

Vue.use(Vuex);

const getCurrentTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

const store = new Vuex.Store({
  state: {
    user: null,
    userProfile: null,
    tasks: [],
    storeConnected: false
  },
  getters: {
    userId: state => state.user && state.user.uid || null,
    userKey: state => {
      if (state.user && state.user.email) {
        return state.user.email.split("@")[0];
      }
      return null;
    },
    userTasks: (state, getters) => {
      if (state.user && getters.userKey) {
        return state.tasks.filter(task => task.executor === getters.userKey);
      }
      return [];
    }
  },
  mutations: {
    setUser(state, val) {
      let user = null;
      if (val) {
        user = {
          displayName: val.displayName,
          email: val.email,
          emailVerified: val.emailVerified,
          phoneNumber: val.phoneNumber,
          photoURL: val.photoURL,
          refreshToken: val.refreshToken,
          uid: val.uid
        };
      }
      state.user = user;
    },
    setStoreConnectState(state, val) {
      state.storeConnected = val;
    },
    ...vuexfireMutations
  },
  actions: {
    login({ commit }, { email, pass }) {
      return new Promise((resolve, reject) => {
        auth.signInWithEmailAndPassword(email, pass).then(
          user => {
            commit("setUser", user);
            resolve();
          },
          err => {
            reject(
              (err && (authErrCodes[err.code] || err.message)) ||
                "Произошла непредвиденная ошибка."
            );
          }
        );
      });
    },
    logout({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        auth
          .signOut()
          .then(() => {
            dispatch("unbindUserData");
            commit("setUser", null);
            resolve();
          })
          .catch(err => {
            reject(err.message || err);
          });
      });
    },
    bindUserData: firestoreAction(({ getters, bindFirestoreRef }) =>
      Promise.all([
        bindFirestoreRef("tasks", db.collection("tasks")),
        bindFirestoreRef(
          "userProfile",
          db.collection("users").doc(getters.userId)
        )
      ])
    ),
    unbindUserData: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef("tasks");
      unbindFirestoreRef("userProfile");
      return Promise.resolve();
    }),
    updateTask: firestoreAction((context, { id, status }) =>
      db
        .collection("tasks")
        .doc(id)
        .update({
          status,
          completeAt: status === "complete" ? getCurrentTime() : ""
        })
    )
  }
});

store.watch(
  state => state.user,
  user => {
    if (user) {
      store.dispatch("bindUserData").then(() => {
        store.commit("setStoreConnectState", true);
      });
    } else {
      store.dispatch("unbindUserData");
      store.commit("setStoreConnectState", false);
    }
  }
);

// handle exist login state on page load
// and unexpected lost auth state
auth.onAuthStateChanged(user => {
  if (user) {
    store.commit("setUser", user);
  } else if (store.state.user) {
    store.dispatch("unbindUserData");
    store.commit("setUser", null);
  }
});

export default store;
