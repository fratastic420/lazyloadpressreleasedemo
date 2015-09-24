Ember-LoadMoreMixin
===================

Mixin for Limiting Model from Controller and Appending at will.

- Embed ember.loadmore.js script tag after ember.js file but before you application.

- Set up your Route however you want, ember-data, ember-model, etc. (I name my my ember apps as App)

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    //whatever you need to do here
  }
});

- Set up your controller, whether you have sort properties, etc, all you need to do is set your desired perPage property.
This defaults to 1 if you do not declare it

- App.ApplicationController = Ember.ArrayController.extend(Ember.LoadMoreMixin,{
  perPage: 3 //This will load 3 records of the model at time
});

- In your template you can add your button anywhere, just bind the action 'loadMore' and target it to your controller.
updatedContent will be what you will use to loop through your model, as the model stays preserved as is

so just loop like so
{{#each item in updatedContent}}
  {{item}}
{{/each}}

- You can disable loading when reaching the length of your model by binding the disabled attr to the hasMore function.
<button {{bind-attr disabled=hasMore}} {{action "loadMore" target="controller"}}>Load More Content</button>

