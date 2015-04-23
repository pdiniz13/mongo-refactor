tasks = new SQL.Collection('tasks', 'postgres://postgres:1234@localhost/postgres');

if (Meteor.isClient) {

  var taskTable = { id: ['$number'], text: ['$string', '$notnull'], checked: ['$bool'], createdat: ['$date'] };
  tasks.createTable(taskTable);

  Template.body.helpers({
    tasks: function () {
        return tasks.select().fetch();
      }
  });

  Template.body.events({
    "submit .new-task": function (event) {
        var text = event.target.text.value;
        tasks.insert({text: text, checked:false}).save();
        event.target.text.value = "";
      return false;
    },
    "click .toggle-checked": function () {
      tasks.update({id: this.id, "checked": !this.checked}).where("id = ?", this.id).save();
    },
    "click .delete": function () {
      tasks.remove().where("id = ?", this.id).save();
    }

  });
}

if (Meteor.isServer) {

  //tasks.createTable({text: ['$string'], checked: ["$bool", {$default: false}]}).save();
  tasks.publish('tasks', function(){
    return tasks.select('id', 'text', 'checked', 'createdat').order('createdat DESC');
  });
}
