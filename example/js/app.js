App = Ember.Application.create({});

App.Router.map(function() {
  // put your routes here
});


App.IndexController = Ember.ArrayController.extend(Ember.LoadMoreMixin,{
  perPage: parseInt($.QueryString['limit']) ? parseInt($.QueryString['limit']) : 1,
  offset: parseInt($.QueryString["offset"]) ? parseInt($.QueryString['offset']) : 0,
  buttonText: 'Load More Content'
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return Ember.$.getJSON('http://www.stellarbiotechnologies.com/media/press-releases/json');
  },
  setupController: function(controller, model) {
    controller.set('content', model.news);
  }
});

Ember.Handlebars.registerBoundHelper('diffForHumans', function(time){
  return moment(time, "YYYY-MM-DD HH:mm:ss").fromNow();
});

Ember.Handlebars.registerBoundHelper('easyFormat', function(time){
  return moment(time).format("MMM Do YYYY");
});

App.IndexView = Ember.View.extend(Ember.LoadmoreViewMixin, {
   needs:['controller'],
   didInsertElement: function() {
      this._super;
      Ember.run.scheduleOnce('afterRender', this, 'fireDOMElements');
   },
   willDestroyElement: function(){
      this.destroyLoadMoreListener();
   },
   fireDOMElements: function() {
      this.setupLoadMoreListener();
      if (this.inViewport()) {
        var controller = this.get('controller'),
        t = this,
        interval = setInterval(function(){
          controller.send('loadMore');
          if (!t.inViewport()) {
           clearInterval(interval);
          }
        },500, t, controller, interval);
      }
   }
});








