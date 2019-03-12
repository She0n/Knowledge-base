<script>
  export default {
    methods: {
      validatePhone(a) {
        if(!a) { return 0; }
        a = a.toString();
        const splitted = a.split('');
        if(splitted.length !== 18) { return 0; }
        if(splitted[0] !== '+') { return 0; }
        if(splitted[1] !== '7') { return 0; }
        if(splitted[3] !== '(') { return 0; }
        if(splitted[7] !== ')') { return 0; }
        if(splitted[12] !== '-') { return 0; }
        if(splitted[15] !== '-') { return 0; }
        const numbers = [4, 5, 6, 9, 10, 11, 13, 14, 16, 17];
        for(let i = 0; i < numbers.length; i++) {
          if(splitted[numbers[i]] < 0) { return 0; }
          if(isNaN(splitted[numbers[i]]))  { return 0; }
        }
        return 1;
      },
      validateEmail(a) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(a).toLowerCase());
      },
    },
  }
</script>
