<script>
  export default {
    data() {
      return {};
    },
    methods: {
      showAnswer(answer) {
        if(!answer) { return 0; }
        if(!answer.title) { return 0; }
        if(!answer.title.trim().length) { return 0; }
        return 1;
      },
      isCorrectAnswer(step, ai) {
        if(!step.correct) { return 0; }
        if(!step.correct.length) { return 0; }
        return step.correct.indexOf(ai) !== -1;
      },
      async getTestById(id) {
        const resp = await $http.post('/get-test-by-id', { test_id: id });
        return ((typeof resp === 'object') ? resp : null);
      },

      callModal() {
        this.force = Math.random();
        $('#test-modal').modal({
          backdrop: 'static',
          keyboard: false
        });
      }

    }
  }
</script>
