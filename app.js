var App = window.App = Ember.Application.create();

App.deferReadiness();

setTimeout(function() {
  App.advanceReadiness();
}, 1000);

window.a = [{
  name: 1,
  done: false,
  num: 1
}, {
  name: 2,
  done: false,
  num: 2
},
 {
  name: 3,
  done: true,
  num: 5
}];


App.IndexController = Ember.Controller.extend({

  search: '',

  chores: a,

  remaining: Ember.computed.filter('chores', function(item) {
    if (item.done) { return false; }
    return item.name === (+this.get('search')) || Ember.isEmpty(this.get('search'));
  }).property('chores.@each.num', 'chores.@each.done', 'search'),

  // remaining: a

  // remaining: Ember.arrayComputed('chores.@each.done', 'chores.@each.num', {
  //   addedItem: function(array, item) {
  //     console.log('added', item.name);
  //     if (!item.done) {
  //       array.pushObject(item);
  //     }
  //     return array;
  //   },
  //   removedItem: function(array, item) {
  //     console.log('removed', item.name);
  //     array.removeObject(item);
  //     return array;
  //   }
  // })
});



App.Post = DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('body')
});

App.Post.reopenClass({
  FIXTURES: []
});

App.ApplicationAdapter = DS.FixtureAdapter;

App.IndexView = Ember.View.extend({

});

App.ApplicationView = Ember.View.extend({

});
