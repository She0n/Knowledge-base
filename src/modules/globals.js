const conf = require('./../../config-file.js');
conf.serverLink = conf.protocol + conf.server;
import store from '@/store/index.js';
import moment from 'moment';
window.store = store;

window.Uploader = {
    images: '.jpg, .png, .jpeg',
    audio: '.mp3',
    video: '.mpeg, .avi, .mov, .wmv, .mp4',
};



window.generateId = function() {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };
  return s4() + s4() + '-' + s4()+'-'+s4()+'-'+s4()+s4();
};
window.rusificate = function(number, a, b, c) {
  let result;
  if ((number - number % 10) % 100 !== 10) {
    if (number % 10 === 1) {
      result = a;
    } else if (number % 10 >= 2 && number % 10 <= 4) {
      result = b;
    } else {
      result = c;
    }
  } else {
    result = c;
  }
  return result;
};

window.offsetLimitReached = function(limit) {

};


window.newLineHtml = function (str) {
  return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
};

//
window.validateNumericInput = function(e) {
    if(e.key === 'Backspace') { return true; }
    return e.charCode >= 48 && e.charCode <= 57;
};
window.validateFloatInput = function(e) {
  if(e.key === 'Backspace') { return true; }
  return e.charCode === 46 || e.charCode >= 48 && e.charCode <= 57;
};
window.stripTags = function (str) {
 return str.replace(/(<([^>]+)>)/ig,"");
};
window.handleMessage = function(str) {
  str = str.toString();
  if(!str.length) { return ''; }
  str = stripTags(str);
  return newLineHtml(str);
};

window.brToNewLine = function(str) {
  return str.replace(/<br\s*[\/]?>/gi, "\n");
};



window.isAnyPartOfElementInViewport = function (el) {

  const rect = el.getBoundingClientRect();
  const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
  const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

  return (vertInView && horInView);
};


window.dateFormatter = {
  reformatSimpleDate: function(timestamp) {
    if(!timestamp) { return ''; }
    if(!timestamp.toString().length) { return ''; }
    let date = new Date(timestamp);
    if(isNaN(date)) { return ''; }
    return this.c(date.getDate())+' '+this.switchMonth(date.getMonth())[1]+' '+date.getFullYear();
  },

  validMinutes(t) {
    if(!t) { return 1; }
    if(t.toString().length !== 2) { return 0; }
    console.log(t);
    if(isNaN(t)) { return 0; }
    let m = parseInt(t);
    return m <= 60;
  },
  validHours(t) {
    if(!t) { return 1; }
    if(!t.toString().length) { return 1; }
    let m = parseInt(t);
    return m <= 23;
  },
  validTime(t) {
    if(!t) { return 0; }
    if(t.toString().length !== 5) { return 0; }
    if(!dateFormatter.validHours(t[0]+''+t[1])) { return 0; }
    if(!dateFormatter.validMinutes(t[3]+''+t[4])) { return 0; }
    return 1;
  },
  add: function() {

  },
  subtract: function() {

  },
  isPast(a) {
    if(!a) { return 0; }
    if(!a.getTime) { return 0; }
    let now = new Date();
    return a.getTime() > now.getTime();
  },
  reformatDate2: function(timestamp) {
    if(!timestamp) { return ''; }
    if(!timestamp.toString().length) { return ''; }
    let date = new Date(timestamp);
    if(isNaN(date.getDate())) { return ''; }
    let now = new Date();
    let a = this.buildDateStringFromDate(now);
    let b = this.buildDateStringFromDate(date);
    if(a === b) { return this.c(date.getHours())+':'+this.c(date.getMinutes()); }
    let yearString = '';
    if(date.getFullYear() !== now.getFullYear()) { yearString = ' '+date.getFullYear(); }
    let time = this.c(date.getHours())+':'+this.c(date.getMinutes());
    return (date.getDate())+' '+this.switchMonth(date.getMonth())[1]+yearString;
  },
  reformatDate3: function(timestamp, at) {
    if(!timestamp) { return ''; }
    if(!timestamp.toString().length) { return ''; }
    let date = new Date(timestamp);
    if(isNaN(date.getDate())) { return ''; }
    let now = new Date();
    let a = this.buildDateStringFromDate(now);
    let b = this.buildDateStringFromDate(date);
    let time = at ? ' в '+this.c(date.getHours())+':'+this.c(date.getMinutes()) : '';
    if(a === b) { return 'Сегодня '+time; }
    let cd = (new Date());
    cd.setDate(now.getDate()+1);
    let c = this.buildDateStringFromDate(cd);
    if(c === b) { return 'Завтра '+time; }
    console.log(c + ' - ' +b);
    let yearString = '';
    if(date.getFullYear() !== now.getFullYear()) { yearString = ' '+date.getFullYear(); }
    return (date.getDate())+' '+this.switchMonth(date.getMonth())[1]+yearString+time;
  },
  isTomorrow(a, b) {
    let date1_tomorrow = new Date(a.getFullYear(), a.getMonth(), a.getDate() + 1);
    return (date1_tomorrow.getFullYear() === b.getFullYear() && date1_tomorrow.getMonth() === b.getMonth() && date1_tomorrow.getDate() === b.getDate());
  },
  reformatDate: function(timestamp, at) {
    if(!timestamp) { return ''; }
    if(!timestamp.toString().length) { return ''; }
    let date = new Date(timestamp);
    if(isNaN(date.getDate())) { return ''; }
    let now = new Date();
    let a = this.buildDateStringFromDate(now);
    let b = this.buildDateStringFromDate(date);
    let time = ' в ' +this.c(date.getHours())+':'+this.c(date.getMinutes());
    if(a === b) { return 'Сегодня '+ time; }
    if(window.dateFormatter.isTomorrow(now, date)) { return 'Завтра '+ time; }
    let yearString = '';
    if(date.getFullYear() !== now.getFullYear()) { yearString = ' '+date.getFullYear(); }
    if(!at) {
      time = '';
    }
    return (date.getDate())+' '+this.switchMonth(date.getMonth())[1]+yearString+time;
  },
  reformatDateToDotted: function(timestamp) {
    if(!timestamp) { return ''; }
    if(!timestamp.toString().length) { return ''; }
    let date = new Date(timestamp);
    if(isNaN(date)) { return ''; }
    return this.c(date.getDate())+'.'+this.c((date.getMonth()+1))+'.'+this.c(date.getFullYear());
  },
  reformatDateNoNZero: function(timestamp, at) {
    if(!timestamp) { return ''; }
    if(!timestamp.toString().length) { return ''; }
    let date = new Date(timestamp);
    if(isNaN(date)) { return ''; }
    let now = new Date();
    let a = this.buildDateStringFromDate(now);
    let b = this.buildDateStringFromDate(date);
    if(a === b) { return 'Сегодня в '+ this.c(date.getHours())+':'+this.c(date.getMinutes()); }
    let yearString = '';
    if(date.getFullYear() !== now.getFullYear()) { yearString = ' '+date.getFullYear(); }
    let time = at ? ' в '+this.c(date.getHours())+':'+this.c(date.getMinutes())+' ' : '';
    return date.getDate()+' '+this.switchMonth(date.getMonth())[1]+yearString+time;
  },
  buildDateStringFromDate: function(date) {
    if(!date) { return ''; }
    return date.getFullYear()+'-'+window.dateFormatter.c((date.getMonth()+1))+'-'+window.dateFormatter.c(date.getDate());
  },
  renderAt(timestamp) {
    let date = new Date(timestamp);
    if(isNaN(date)) { return ''; }
    let time = ' в '+this.c(date.getHours())+':'+this.c(date.getMinutes())+' ';
    return time;
  },
  c: function(a) {
    if(a > 10) { return a; }
    a = a.toString();
    if(a.length < 2) { return '0'+a; }
    return a;
  },
  switchMonth: function(month) {
    switch(month) {
      case 0: return ['январь', 'января'];
      case 1: return ['февраль', 'февраля'];
      case 2: return ['март', 'марта'];
      case 3: return ['апрель', 'апреля'];
      case 4: return ['май', 'мая'];
      case 5: return ['июнь', 'июня'];
      case 6: return ['июль', 'июля'];
      case 7: return ['август', 'августа'];
      case 8: return ['сентябрь', 'сентября'];
      case 9: return ['октябрь', 'октября'];
      case 10: return ['ноябрь', 'ноября'];
      default: return ['декабрь', 'декабря'];
    }
  }

};


window.switchGraphicalUserStatus = function(user) {
  switch(user.status) {
    case 1: return '<span class="c-badge c-badge--small c-badge--success">Работает</span>';
    default: return '<span class="c-badge c-badge--small c-badge--secondary">Уволен(а)</span>';
  }
};

window.footerReached = function(limit) {
  if(document.body.scrollHeight <= document.body.clientHeight) { return; }
  var possible = document.body.scrollHeight - document.body.clientHeight;
  var els = possible-window.scrollY;
  if(els < 350) { return true; }
  return false;
};




window.getDefaultImage = function() {
  return conf.defaultImage;
};

window.renderUserRealName = function (user) {
  if(!user) { return ''; }
  if(!user.first_name && !user.last_name) { return user.username; }
  let name = '';
  if(user.first_name) { name += user.first_name + ' '; }
  if(user.last_name) { name += user.last_name; }
  return name;
};
window.renderUserInitials = function(user) {
  if(!user) { return ''; }
  if(!user.last_name) { return ''; }
  let name = user.last_name;
  if(user.first_name) { name += ' '+user.first_name[0]+'.'; }
  if(user.third_name) { name += ' '+user.third_name[0]+'.'; }
  return name;
};
window.renderUserAge = function(user) {
  if(!user) { return ''; }
  if(!user.birthday) { return ''; }
  let b = new Date(user.birthday);
  if(!b.getDate()) { return ''; }
  let now = new Date();
  let ageDifMs = now - b.getTime();
  let ageDate = new Date(ageDifMs); // miliseconds from epoch
  let age = Math.abs(ageDate.getUTCFullYear() - 1970);
  return age + ' ' +window.rusificate(age, 'год', 'года' ,'лет');
};
window.renderUserExperience = function(user) {
  if(!user || !user.expirience) { return ''; }
  return user.expirience ? user.expirience + ' ' +rusificate(Math.ceil(user.expirience), 'год', 'года' ,'лет') : '';
};
window.renderUserFirstName = function(user) {
  if(!user) { return ''; }
  if(!user.first_name && !user.last_name) { return user.username; }
  if(user.first_name) { return user.first_name; }
  return user.last_name;
};

window.setDefaultAvatar = function(el, user) {
  el.src = window.getDefaultAvatar(user);
};

window.getDefaultAvatar = function(user) {
  if(typeof user === 'string') {
    return '/static/images/default-'+user+'.svg';
  }
  if(!user || !user.usertype) { return '/static/images/default-user.svg';  }
  return '/static/images/default-'+user.usertype+'.svg';
};

window.setDefaultImage = function(el) {
  el.src = window.getDefaultImage();
};

window.image = function(a) {
  return conf.serverLink+a;
};

window.bottomAchieved = function() {

  return ((window.innerHeight + window.scrollY + 300) >= document.body.offsetHeight);
};




window.toInt = function(a) {
  a = parseInt(a);
  return a ? a : 0;
};

window.serialize = (a) => {
  let s = '';
  for(let prop in a) {
    s += prop+'='+a[prop]+'&';
  }
  return s.length ? '?'+s.substring(0, s.length - 1) : '';
};

window.isFieldEmpty = (a) => {
  if (!a) {
    return 1;
  }
  if (typeof a === 'string') {
    if (!a.trim().length) {
      return 1;
    }
  }
  return 0;
};

export default conf;
