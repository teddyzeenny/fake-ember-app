var App = window.App = Ember.Application.create();

App.Router.map(function() {
  this.route('posts');
});

App.ApplicationRoute = Ember.Route.extend();

App.IndexRoute = Ember.Route.extend({
  setupController: function() {
    Ember.run.later(this, function() {
      this.transitionTo('posts');
    }, 500);
  }
});

App.PostsRoute = Ember.Route.extend({
  setupController: function() {
    var p = new Ember.RSVP.resolve('[<App.User:1>, <App.User:2>]', "Find Users");
    p.then(function() {
      throw "HTTP STATUS 404 - NOT FOUND";
    }, null, "Find Comments");
  }
});

