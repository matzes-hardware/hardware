$.noty.defaults = {
  layout: 'bottomRight',
  theme: 'default',
  type: 'success',
  dismissQueue: true, // Очередь сообщений
  template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
  animation: {
    open: {height: 'toggle'},
    close: {height: 'toggle'},
    easing: 'swing',
    speed: 500 // Скорость появления и исчезновения подсказки
  },
  timeout: 3500, // Время показа подскзаки
  force: true, // adds notification to the beginning of queue when set to true
  modal: false,
  closeWith: ['click', 'button'], // ['click', 'button', 'hover']
  callback: {
    onShow: function() {},
    afterShow: function() {},
    onClose: function() {},
    afterClose: function() {}
  },
  buttons: false // an array of buttons
};