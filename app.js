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
  this.route('ember_data');
});


App.ApplicationRoute = Ember.Route.extend({
  actions: {
    lazyChain: function() {
      var firstPromise = new Ember.RSVP.Promise(function(resolve) {

      }, "First Promise");

      var secondPromise = new Ember.RSVP.Promise(function(resolve) {
        resolve();
      }, "Second Promise");

      Ember.run.later(function() {
        var then = firstPromise.then(function() {

        }, null, 'First promise lazy chain');

        Ember.run.later(function() {
          then.then(function() {

          }, null, "First promise second chain")
        }, 1000);
      }, 1000);
    }
  }
});

App.NormalRoute = Ember.Route.extend({
  model: function() {
    return { some: 'model' };
  }
});

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




App.EmberDataController = Ember.Controller.extend({
  fetchRecordArray: function() {
    var self = this;
    this.store.find('post', {}).then(function(records) {
      self.set('recordArray', records);
    });
  }.on('init'),
  fetchRecord: function() {
    var self = this;
    this.store.find('post', 1).then(function(record) {
      self.set('record', record);
      record.get('comments').then(function(comments) {
        self.set('commentsManyArray', comments);
      }); // prefetch
    });
  }.on('init'),
  fetchComment: function() {
    var self = this;
    this.store.find('comment', 1).then(function(record) {
      self.set('comment', record);
    });
  }.on('init'),

  actions:  {
    findAll: function() {
      this.store.find('post');
    },
    findById: function() {
      this.store.find('post', 1);
    },
    findQuery: function() {
      this.store.find('post', { some: 'query' });
    },
    createRecord: function() {
      this.store.createRecord('post').save();
    },
    updateRecord: function() {
      this.get('record').save();
    },
    destroyRecord: function() {
      var comment = this.store.push('comment', {
        id: Ember.generateGuid(),
        title: "Comment To Destroy"
      });
      comment.destroyRecord();
    },
    saveRecordArray: function() {
      this.get('recordArray').save();
    },
    asyncBelongsTo: function() {
      Ember.propertyDidChange(this.get('comment'), 'post');
      this.get('comment.post');
    },
    asyncHasMany: function() {
      Ember.propertyDidChange(this.get('record'), 'comments');
      this.get('record.comments');
    },
    reload: function() {
      this.get('record').reload();
    },
    manyArrayFetch: function() {
      this.get('commentsManyArray').fetch();
    }
  }
});


App.Store = DS.Store.extend();

App.ApplicationAdapter = DS.FixtureAdapter.extend({
  queryFixtures: function(fixtures) {
    return fixtures;
  }
});

App.Post = DS.Model.extend({
  title: DS.attr('string'),
  comments: DS.hasMany('comment', { async: true } )
});

App.Comment = DS.Model.extend({
  title: DS.attr('string'),
  post: DS.belongsTo('post', { async: true } )
});

App.Post.reopenClass({
  FIXTURES: [
  { id: 1, title: 'Post 1', comments: [1,2]},
  { id: 2, title: 'Post 2', comments: [3] }
  ]
});

App.Comment.reopenClass({
  FIXTURES: [
  { id: 1, title: 'Comment 1', post: 1 },
  { id: 2, title: 'Comment 2', post: 1 },
  { id: 3, title: 'Comment 3', post: 2 }
  ]
});
