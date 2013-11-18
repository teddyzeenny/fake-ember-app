var App = window.App = Ember.Application.create();

App.deferReadiness();

$(function() {
  Ember.run.later(function() {
    App.advanceReadiness();
  }, 500);
});


App.Router.map(function() {
  this.resource('normal', { path: '/'});
  this.route('reject');
  this.route('pending');
  this.route('slow');
});


App.NormalRoute = Ember.Route.extend({
  model: function() {
    return new Ember.RSVP.Promise(function(resolve) {
      Ember.run.later(function() {
        resolve([Ember.Object.create({title: "title"})]);
      }, 500);
    });
  }
});

App.PostsView = Em.View.extend({classNames: ['posts']});
App.PostView = Em.View.extend({classNames: ['post']});

App.RejectRoute = Ember.Route.extend({
  model: function() {
    var p = new Ember.RSVP.resolve('[<App.User:1>, <App.User:2>]', "Find Users");
    return p.then(function() {
      throw "HTTP STATUS 404 - NOT FOUND";
    }, null, "Find Comments");
  }
});

App.PendingRoute = Ember.Route.extend({
  model: function() {
    return new Ember.RSVP.Promise(Ember.K, "Never ending promise");
  }
});


App.SlowRoute = Ember.Route.extend({
  beforeModel: function() {
    return new Ember.RSVP.Promise(function(resolve) {
      Ember.run.later(null, resolve, "before-model", 5000);
    }, "Slow Before Model Promise");
  },
  model: function() {
    return new Ember.RSVP.Promise(function(resolve) {
      Ember.run.later(null, resolve, "some-model", 5000);
    }, "Slow Model Promise");
  },
  afterModel: function() {
    return new Ember.RSVP.Promise(function(resolve) {
      Ember.run.later(null, resolve, "after-model", 5000);
    }, "Slow After Model Promise");
  }

});

