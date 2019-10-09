<template>
  <v-slide-y-transition group>
    <v-card
      v-for="item in items"
      :key="item.id"
      class="mb-1"
      :loading="itemProcessingId === item.id"
    >
      <template v-if="completed">
        <v-list-item
          two-line
          dense
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
            <v-list-item-subtitle>
              Заказ: №{{ item.order }}
              <v-chip
                class="mx-2"
                color="teal"
                text-color="white"
                x-small
              >
                {{ item.completeAt }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn
              icon
              @click="showDetails(item.id)"
            >
              <v-icon color="grey lighten-1">
                mdi-information
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>

      <template v-else>
        <v-list-item two-line>
          <v-list-item-avatar @click="expandActions(item.id)">
            <v-icon
              v-if="item.status === 'new'"
              color="green"
              large
              v-text="'mdi-new-box'"
            />
            <v-icon
              v-else-if="item.status === 'inPause'"
              large
              color="deep-orange"
              v-text="'mdi-pause'"
            />
            <v-icon
              v-else-if="item.status === 'inWork'"
              large
              color="blue"
              v-text="'mdi-play'"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
            <v-list-item-subtitle>
              Заказ: №{{ item.order }}
              <v-chip
                v-if="item.hot"
                class="mx-2"
                color="red"
                text-color="white"
                x-small
              >
                <v-icon left>
                  mdi-fire
                </v-icon>
                Срочно
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action @click="showDetails(item.id)">
            <v-btn icon>
              <v-icon color="grey lighten-1">
                mdi-information
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-expand-transition>
          <div v-show="expandedTaskId === item.id">
            <v-divider />
            <v-card-actions>
              <template v-if="item.status === 'new'">
                <v-btn
                  text
                  color="primary"
                  @click="updateTask(item.id, 'inWork')"
                >
                  <v-icon left>
                    mdi-play
                  </v-icon>
                  Начать выполнение
                </v-btn>
                <div class="flex-grow-1" />
              </template>
              <template v-else-if="item.status === 'inPause'">
                <v-btn
                  text
                  color="primary"
                  @click="updateTask(item.id, 'inWork')"
                >
                  <v-icon left>
                    mdi-play
                  </v-icon>
                  Продолжить работу
                </v-btn>
                <div class="flex-grow-1" />
              </template>
              <template v-else-if="item.status === 'inWork'">
                <v-btn
                  text
                  color="warning"
                  @click="updateTask(item.id, 'inPause')"
                >
                  <v-icon left>
                    mdi-pause
                  </v-icon>
                  Приостановить
                </v-btn>
                <div class="flex-grow-1" />
                <v-divider vertical />
                <div class="flex-grow-1" />
                <v-btn
                  text
                  color="primary"
                  @click="updateTask(item.id, 'complete')"
                >
                  Выполнено
                  <v-icon right>
                    mdi-check
                  </v-icon>
                </v-btn>
              </template>
            </v-card-actions>
          </div>
        </v-expand-transition>
      </template>
    </v-card>
  </v-slide-y-transition>
</template>

<script>
export default {
  name: "components_TaskList",
  props: {
    completed: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    itemProcessingId: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    expandedTaskId: ""
  }),
  methods: {
    showDetails(taskId) {
      this.$emit("showDetails", taskId);
    },
    expandActions(taskId) {
      if (taskId && this.expandedTaskId === taskId) {
        this.expandedTaskId = "";
      } else {
        this.expandedTaskId = taskId;
      }
    },
    updateTask(taskId, status) {
      this.expandedTaskId = "";
      this.$emit("update", { id: taskId, status });
    }
  }
};
</script>
