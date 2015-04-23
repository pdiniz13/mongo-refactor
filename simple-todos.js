
tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {

  Meteor.subscribe('tasks');

  Template.body.helpers({
    tasks: function () {
        return tasks.find({});
      }
  });

  Template.body.events({
    "submit .new-task": function (event) {
        var text = event.target.text.value;
        tasks.insert({
          text: text,
          checked:false
        });
        event.target.text.value = "";
      return false;
    },

    "click .toggle-checked": function () {
      tasks.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function () {
      tasks.remove(this._id);
    }

  });

}

if (Meteor.isServer) {

  Meteor.publish('tasks', function(){
    return tasks.find({});
  });

}
