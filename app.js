var App = window.App = Ember.Application.create();

App.Router.map(function() {
  this.route('post');
});

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return Ember.RSVP.Promise(function(resolve) {
      Ember.run.later(null, resolve, 1000);
    }, "Delay application route");
  }
});

App.IndexRoute = Ember.Route.extend({
  setupController: function() {
    var p = new Ember.RSVP.resolve('[<App.User:1>, <App.User:2>]', "Find Users");
    p.then(function() {
      throw "HTTP STATUS 404 - NOT FOUND";
    }, null, "Find Comments");
  },

  model: function() {
    return Ember.RSVP.Promise(function(resolve) {
      Ember.run.later(null, resolve, 1000);
    }, "Model Promise");
  }
});
