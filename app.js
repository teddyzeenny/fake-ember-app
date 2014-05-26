var App = window.App = Ember.Application.create();

App.deferReadiness();

setTimeout(function() {
  App.advanceReadiness();
}, 1000);

App.IndexController = Ember.Controller.extend({
  isActive: true,

  items: function() {
    var a = [];
    // for (var i = 0; i < 1000; i++ ){
    //   a.push(i);
    // }
    return a;
  }.property()
});
