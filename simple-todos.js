// Defining 2 SQL collections. The additional paramater is the postgres connection string which will only run on the server
tasks = new Mongo.Collection('tasks');
username = new Mongo.Collection('username');

if (Meteor.isClient) {

  Meteor.subscribe('tasks');
  Meteor.subscribe('username');

  Session.set('user', 'all')


  Template.body.helpers({
    usernames: function () {
      var test = username.find({});
      return username.find({});
    },
    tasks: function () {
      if (Session.get('user') === 'all'){
        return tasks.find({});
      }
      return tasks.find({name: Session.get('user')});
    }
  });

  Template.body.events({
    "submit .new-task": function (event) {
      if (event.target.category.value){
        var text = event.target.text.value;
        tasks.insert({
          text:text,
          checked:false,
          name: event.target.category.value
        });
        event.target.text.value = "";
      } else{
        alert("please add a user first");
      }
      return false;
    },
    "submit .new-user": function (event) {
      var text = event.target.text.value;
      username.insert({
        name:text
      });
      event.target.text.value = "";

      return false;
    },
    "click .toggle-checked": function () {
      tasks.update(this._id, {$set: {checked: ! this.checked}});
    },
    "click .delete": function () {
      tasks.remove(this._id);
    },
    "change .catselect": function(event){
      Session.set('user',event.target.value);
    }
  });

}

if (Meteor.isServer) {

  Meteor.publish('tasks', function(){
    return tasks.find({});
  });

  Meteor.publish('username', function(){
    return username.find({});
  });
}
