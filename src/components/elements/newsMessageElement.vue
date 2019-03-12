<template>

</template>
<script>
  export default {
    props: ['message'],
    methods: {
      renderDocumentMessage(doc) {
        let str = doc.document_type_title + ' ' +doc.title;
        if(typeof doc.document_data === 'object' && doc.document_type === 'check') {
          str += ' на сумму '+doc.document_data.amount+ ' р.';
        }
        return str;
      },
      callFeedImage(msg, index) {
        window.gallery.items = msg;
        window.gallery.setItem(index);
        window.gallery.callModal();
      },
      renderCreatedAt(cr) {
        return 'Запись сделана ' + window.dateFormatter.renderAt(cr);
      },
      displayPostDate(index) {
        if (!this.posts[index - 1]) {
          return 1;
        }
        if (window.dateFormatter.buildDateStringFromDate(new Date(this.posts[index].created_at))
          === window.dateFormatter.buildDateStringFromDate(new Date(this.posts[index - 1].created_at))) {
          return 0;
        }
        return 1;
      },
      postDelimeterDate(created_at) {
        let date = window.dateFormatter.buildDateStringFromDate(new Date(created_at));
        let now = new Date();
        if (date === (window.dateFormatter.buildDateStringFromDate(now))) {
          return 'Сегодня';
        }
        let yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (window.dateFormatter.buildDateStringFromDate(yesterday) === date) {
          return 'Вчера';
        }
        return window.dateFormatter.reformatDateNoNZero(created_at);
      },
    }
  }
</script>
