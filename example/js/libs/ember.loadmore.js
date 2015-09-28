Ember.LoadMoreMixin = Ember.Mixin.create({
   start: function() {
      return this.get('offset');
   }.property('offset'),
   end: function() {
      return this.get('perPage') + this.get('offset');
   }.property('perPage'),
   sliceContent: null,
   totalCount: function() {
      return this.get('content').get('length');
   }.property('content.@each'),
   hasMore: function() {
      return this.get('totalCount') <= this.get('end'); 
   }.property('totalCount', 'end'),
   loadingMore: false,
   counter: 5,
   countDown: false,
   moreThanOne: function() {
      return this.get('perPage') > 1;
   }.property('perPage'),
   updatedContent: function (){
      var models = this.get('content'),
      slice,
      start = this.get('start') ? this.get('start') : 0,
      end = this.get('end') ? this.get('end') : 1;
      this.set('sliceContent', models);
      slice = this.get('sliceContent');
      if (end > this.get('totalCount')) end = this.get('totalCount');
      slice = slice.slice(start, end);
      this.setProperties({'sliceContent': slice, 'loadingMore': false});
      return slice;   
   }.property('content.@each', 'perPage', 'end', 'sliceContent', 'start'),
   actions: {
      loadMore: function() {
         if (this.get('loadingMore') === false) {
            this.set('loadingMore', true);
            var end = this.get('end'),
            perPage = this.get('perPage') ? this.get('perPage') : 1;
            end = parseInt(end) + parseInt(perPage);
            this.setProperties({'end': end});
         }
      }
   }
});

Ember.LoadmoreViewMixin = Ember.Mixin.create( {
   setupLoadMoreListener: function() {
      $(document).on('scroll', $.proxy(this.fireScroll, this));
   },
   destroyLoadMoreListener: function() {
      $(document).off('scroll', $.proxy(this.fireScroll, this));
   },
   disabled: function() {
      controller = this.get('controller');
      return controller.get('hasMore');
   },
   isLoading: function() {
     controller = this.get('controller');
     return controller.get('isLoading');
   },
   toggleLoading: function() {
      var t = this,
      controller = t.get('controller'),
      interval = null;
      if (t.inViewport() && !controller.get('countDown')) {
        controller.set('countDown', true);
        interval = setInterval(function(){
          var count = controller.get('counter') - 1;
          controller.set('counter', count);
          if ((count ) < 1) {
              controller.setProperties({'counter':5, 'countDown' : false});
              controller.send('loadMore');
              clearInterval(interval);
          }
        },1000, t, controller, interval);
      }
   }.observes('controller.updatedContent'),
   fireScroll: function() {
      if (this.inViewport() === true && !this.disabled() && !this.isLoading()) {
        this.toggleLoading();
      }else if (this.disabled()) {
         this.destroyLoadMoreListener();
      }
   },
   inViewport: function()
   {
      var el = this.get('elementWatch') ? this.get('elementWatch') : $('.loadMore');
      if (el.length < 1) {
         return false;
      }
      if (typeof jQuery === "function" && el instanceof jQuery) {
          el = el[0];
      }
      var rect = el.getBoundingClientRect();
      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
          rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
      );
   }
});

