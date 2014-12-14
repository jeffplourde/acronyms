Acronyms = new Mongo.Collection("acronyms");

if (Meteor.isClient) {
  Template.body.helpers({
    acronyms: function () {
      if(Session.get("prefix")) {
        return Acronyms.find({active:true, "acronym": new RegExp("^"+Session.get("prefix"), 'i')}, {sort: {acronym: 1}});
      } else {
        return Acronyms.find({active:true}, {sort: {acronym: 1}});
      }
    }
  });
  Template.acronym.created = function() {
    isEditing = false;
  };
  Template.acronym.helpers({
    editing: function() {
      return Template.instance().isEditing;
    },
    unlocked: function() {
      return !this.locked;
    },
    hasUrl: function() {
      return this.url && "" != this.url;
    }
  });
  Template.acronym.events({
    "click .edit": function(e, t) {
      Acronyms.update(this._id, {$set: {locked: true}});
      t.isEditing = true;
    },
    "click .unlock": function(e, t) {
      Acronyms.update(this._id, {$set: {locked: false}});
    },
    "submit .update-acronym": function(e, t) {
      var upd = {
        acronym: e.target.acronym.value,
        meaning: e.target.meaning.value,
        url: e.target.url.value,
        locked: false
      };
      Acronyms.update(this._id, {$set: upd});
      t.isEditing = false;
      return false;
    },
    "click .cancel": function(e, t) {
      Acronyms.update(this._id, {$set: {locked: false}});
      t.isEditing = false;
    },
  });
  Template.body.events({
    "submit .new-acronym": function(event) {
      var acronym = event.target.acronym.value;
      Acronyms.insert({acronym: acronym, active: true, locked: false});
      event.target.acronym.value = "";
      return false;
    },
    "click .delete": function() {
      Acronyms.update(this._id, {$set: {active: false}});
    },
    "keyup .prefix": function(e) {
      Session.set("prefix", e.target.value);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
