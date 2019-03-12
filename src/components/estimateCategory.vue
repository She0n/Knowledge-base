<template>
  <tr class="c-table__row">
    <td colspan="15" class="c-table__cell">
      <div v-html="item.title"></div>
      <table>
        <tbody>
        <tr v-for="job in item.jobs">
          <td>job</td>
        </tr>
        </tbody>
      </table>
    </td>
  </tr>

</template>
<script>

  export default {
    props: ['item'],
    data() {
      return {

      };
    },
    methods: {

    },

  }
</script>
