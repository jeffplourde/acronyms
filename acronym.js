Acronyms = new Meteor.Collection("acronyms");

Router.route('/acronyms', function() {
  console.log("/acronyms : ", this.request.originalUrl);
  this.render('acronym');
});
/*
Router.route('/', function() {
  var req = this.request;
  var res = this.response;
  var url = this.request.originalUrl;
  var newUrl = url.protocol+'//'+url.hostname+'/acronyms';
  console.log('/ : ', this.request.originalUrl, newUrl);
  res.writeHead(302, {'Location': newUrl});
  res.end();
}, {where: 'server'});
*/
if (Meteor.isClient) {
  Meteor.subscribe("acronyms");
  Template.body.helpers({
    acronyms: function () {
      if(Session.get("prefix")) {
        var prefixRegex = new RegExp(Session.get("prefix"), 'i');
        return Acronyms.find({active:true, $or: [{"acronym": prefixRegex}, {"meaning": prefixRegex}]}, {sort: {acronym: 1}});
      } else {
        return Acronyms.find({active:true}, {sort: {acronym: 1}});
      }
    },
    isConnected: function() {
      return Meteor.status().connected;
    }
  });
  Template.acronym.created = function() {
    isEditing = false;
  };
  Template.acronym.helpers({
    editing: function() {
      return Meteor.userId() && Template.instance().isEditing;
    },
    unlocked: function() {
      return Meteor.userId() && !this.locked;
    },
    hasUrl: function() {
      return this.url && "" != this.url;
    }
  });
  Template.acronym.events({
    "click .edit": function(e, t) {
      Meteor.call("lockAcronym", this._id);
      t.isEditing = true;
    },
    "click .unlock": function(e, t) {
      Meteor.call("unlockAcronym", this._id);
    },
    "submit .update-acronym": function(e, t) {
      Meteor.call("updateAcronym", this._id, e.target.acronym.value, e.target.meaning.value, e.target.url.value);
      t.isEditing = false;
      return false;
    },
    "click .cancel": function(e, t) {
      Meteor.call("unlockAcronym", this._id);
      t.isEditing = false;
    },
  });
  Template.body.events({
    "submit .new-acronym": function(event) {
      var acronym = event.target.acronym.value;
      Meteor.call("addAcronym", acronym);
      event.target.acronym.value = "";
      return false;
    },
    "click .delete": function() {
      Meteor.call("deleteAcronym", this._id);
    },
    "keyup .prefix": function(e) {
      Session.set("prefix", e.target.value);
    }
  });
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.publish("acronyms", function() {
    return Acronyms.find({active:true}, {sort: {acronym: 1}});
  });
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Meteor.methods({
  addAcronym: function(acronym, meaning, url) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var data = {
      acronym: acronym,
      meaning: meaning,
      url: url,
      active: true,
      locked: false,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    };
    Acronyms.insert(data);
  },
  deleteAcronym: function(id) {
    Acronyms.update(id, {$set: {active: false}});
  },
  updateAcronym: function(id, acronym, meaning, url) {
    Acronyms.update(id, 
      {$set: {
        acronym: acronym,
        meaning: meaning,
        url: url,
        locked: false
      }}
    );
  },
  lockAcronym: function(id) {
    Acronyms.update(id, {$set: {locked:true}});
  },
  unlockAcronym: function(id) {
    Acronyms.update(id, {$set: {locked:false}});
  }
});
