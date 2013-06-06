var fire = new Backbone.Marionette.Application();
fire.addRegions({
  'nav': '#top-nav',
  'main': '#main'
});
fire.NavController = {
  responderView: function(){
    fire.applayout.content.show(new fire.RespondersView());
  }
};
fire.NavRouter = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    "responders": "responderView"
  },
  controller: fire.NavController
});


NavbarLayout = Backbone.Marionette.Layout.extend({
  template: "#navbar-layout"
});

AppLayout = Backbone.Marionette.Layout.extend({
  template: "#application-layout",
  regions: {
    sidebar: "#sidebar",
    content: "#content"
  }
});



fire.addInitializer(function (options){
  fire.applayout = new AppLayout();
  fire.navlayout = new NavbarLayout();
  fire.nav.show(fire.navlayout);
  fire.main.show(fire.applayout);
  new fire.NavRouter();
});


fire.on('initialize:after', function(){
  Backbone.history.start();
});

fire.Responder = Backbone.Model.extend({
  defaults: {},
  parse:function (response) {
    response.id = response._id; return response;
  }
});

fire.Responders =  Backbone.Collection.extend({
  model: fire.Responder,
  url: '/api/responders/'
});

fire.ResponderView = Backbone.Marionette.ItemView.extend({
  tagName: "tr",
  template: "#responder-template",
  events:{
    'click .delete': 'deleteResponder'
  },
  deleteResponder: function(){
    this.model.destroy();
  }
}),

fire.RespondersView = Backbone.Marionette.CompositeView.extend({
  events:{
     'click .add': 'addResponder'
  },
  collection: new fire.Responders(),
  initialize: function(){
    this.collection.fetch();
  },
  addResponder: function(){
    formdata = {};
    $("#responder-form").children("input").each(function(i,el){
      formdata[el.id] = $(el).val();
    });
    this.collection.create(formdata);
  },
  itemView: fire.ResponderView,
  itemViewContainer: "tbody",
  template: "#responders-template"
});




fire.start();
