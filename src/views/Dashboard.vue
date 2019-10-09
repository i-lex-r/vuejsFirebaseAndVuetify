<template>
  <main-layout>
    <template #toolbarTitle>
      Рабочие задачи
    </template>

    <template #default>
      <v-row>
        <v-col cols="12">
          <template v-if="userNoTasks">
            <v-alert
              outlined
              type="info"
            >
              У вас пока нет задач.
            </v-alert>
          </template>

          <template v-else>
            <h2 class="title mb-2">Текущие</h2>
            <TaskList
              :items="userWorkTasks"
              :item-processing-id="processingTaskId"
              @showDetails="showTaskDetails"
              @update="processTask"
            />

            <h2 class="title mt-4 mb-2">Выполненные</h2>
            <TaskList
              completed
              :items="userCompleteTasks"
              @showDetails="showTaskDetails"
            />

            <v-dialog
              v-model="selectedTaskId"
              max-width="500"
            >
              <v-card>
                <v-card-title class="headline">
                  Какой-то заголовок формы задачи?
                </v-card-title>

                <v-card-text>
                  Здесь может быть подроюное описание, какие-то параметры,
                  переписка/обсуждение в контексте этой задачи и конечно
                  доступные действия.
                </v-card-text>

                <v-card-actions>
                  <div class="flex-grow-1" />

                  <v-btn
                    color="green darken-1"
                    text
                    @click="selectedTaskId = ''"
                  >
                    Disagree
                  </v-btn>

                  <v-btn
                    color="green darken-1"
                    text
                    @click="selectedTaskId = ''"
                  >
                    Agree
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-col>
      </v-row>
    </template>
  </main-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import MainLayout from "@/layouts/Main";
import TaskList from "@/components/TaskList";

export default {
  name: "views_Dashboard",
  components: {
    MainLayout,
    TaskList
  },

  data: () => ({
    selectedTaskId: "",
    processingTaskId: ""
  }),

  computed: {
    ...mapState(["tasks"]),
    userWorkTasks() {
      return this.tasks.filter(i => i.status !== "complete");
    },
    userCompleteTasks() {
      return this.tasks.filter(i => i.status === "complete");
    },
    userNoTasks() {
      return !this.tasks.length;
    },
    selectedTask() {
      if (this.selectedTaskId) {
        return this.items.filter(i => i.id === this.selectedTaskId)[0];
      }
      return null;
    }
  },

  methods: {
    ...mapActions(["updateTask"]),
    processTask({ status, id }) {
      this.processingTaskId = id;
      this.updateTask({ id, status }).finally(() => {
        this.processingTaskId = "";
      });
    },
    showTaskDetails(taskId) {
      this.selectedTaskId = taskId;
    }
  }
};
</script>
