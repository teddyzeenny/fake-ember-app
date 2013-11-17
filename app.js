var App = window.App = Ember.Application.create();

App.deferReadiness();

$(function() {
  Ember.run.later(function() {
    App.advanceReadiness();
  }, 500);
});


App.Router.map(function() {
  // this.route('posts');
  this.resource('posts', { path: '/'} , function() {
    this.resource('post', { path: '/post/:post_id'} );
  });
  this.route('pending');
  this.route('slow');
});

App.ApplicationAdapter = DS.FixtureAdapter.extend();


App.Post = DS.Model.extend({
  title: DS.attr(),
  bodty: DS.attr()
});

App.Post.reopenClass({
  FIXTURES: [
    { id: 1, title: 'My first post', body: 'This is the body' },
    { id: 2, title: 'Second post', body: 'This is the second body'}
  ]
});

App.ApplicationRoute = Ember.Route.extend();

App.PostsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('post');
  }
});

App.PostsView = Em.View.extend({classNames: ['posts']});
App.PostView = Em.View.extend({classNames: ['post']});

App.PostRoute = Ember.Route.extend({
  setupController: function() {
    var p = new Ember.RSVP.resolve('[<App.User:1>, <App.User:2>]', "Find Users");
    p.then(function() {
      throw "HTTP STATUS 404 - NOT FOUND";
    }, null, "Find Comments");


    return this._super.apply(this, arguments);
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

