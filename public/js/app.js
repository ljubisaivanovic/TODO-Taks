function showModal(title, contents) {
    var $title = $('#taskModal-title');
    var $contents = $('#taskModal-contents');

    $title.text(title);
    $contents.html(contents);

    $('#taskModal').modal('show');
}

function hideModal() {
    $('#taskModal').modal('hide');
}

$(document).ready(function () {
    var $table = $('#tasks-table');
    $dataTable = $table.DataTable();

    window.csrf = $('meta[name=csrf-token]').attr('content');
    window.toastr = toastr;

    window.toastr.options = {
        positionClass: "toast-bottom-right"
    };

    $(document).on('click', '.new-btn', function(e) {
        var contents = '<form data-csrf="' + window.csrf + '"> <div class="row"> <div class="col-md-4"> <label for="summary">Summary</label> </div><div class="col-md-8"> <div class="form-group"> <input type="text" class="form-control" id="summary"> </div></div></div><div class="row"> <div class="col-md-4"> <label for="date">Due Date</label> </div><div class="col-md-8"> <div class="form-group"> <input type="date" class="form-control" id="date"> </div></div></div><div class="row"> <div class="col-md-4"> <label for="description">Description</label> </div><div class="col-md-8"> <div class="form-group"> <textarea class="form-control" id="description"></textarea> </div></div></div><div class="row"> <div class="col-md-6"><button id="new-task-btn" type="button" class="btn btn-primary float-left">Submit</button></div><div class="col-md-6"><button type="button" class="btn btn-danger float-right" data-dismiss="modal">Cancel</button></div></div></form>';

        showModal('Create new task', contents);
    });

    $(document).on('click', '#new-task-btn', function(e) {
        var $form = $(this).parent().parent().parent();
        var $table = $('#tasks-table');

        $.ajax('/tasks', {
            method: 'POST',
            data: [
                {name: '_token', value: $form.attr('data-csrf')},
                {name: 'summary', value: $form.find('#summary').val()},
                {name: 'due_date', value: $form.find('#date').val()},
                {name: 'description', value: $form.find('#description').val()}
            ],
            success: function (response) {
                var task = response[0];

                var $task = {
                    0: task.summary,
                    1: '<select class="form-control status-select" name="status" id="status"> <option ' +
                    'value="1" ' + (task.status==1 ? 'selected' : '') + '>Pending</option> <option value="2" ' + (task.status==2 ? 'selected' : '') + '>In progress</option> <option value="3" ' + (task.status==3 ? 'selected' : '') + '>Completed</option> </select>',
                    2: task.due_date,
                    3: '<button class="btn btn-primary edit-btn" type="button" data-action="edit"><i class="fa ' +
                    'fa-pencil"></i></button> <button class="btn ' + (task.status==3 ? 'btn-success' : 'btn-secondary') + ' complete-btn" type="button" name="complete"><i class="fa fa-check"></i></button> <button class="btn btn-danger delete-btn" type="button" name="delete"><i class="fa fa-trash"></i></button>'
                }

                $row = $dataTable.row.add($task).draw();

                $($row.node()).find('td:first-child').addClass('summary');

                $($row.node()).attr('data-status', 1);
                $($row.node()).attr('data-id', task.id);
                $($row.node()).attr('data-csrf', response.csrf_token);

                var $checkbox = $('#show-completed');
                var checked = $(this).is(':checked');

                if (checked) {
                    $($row.node()).hide();
                }

                hideModal();

                window.toastr.success('Task successfully added!');
            }
        });
    });

    $(document).on('click', '.edit-btn', function() {
        var $task_id = $(this).parent().parent().attr('data-id');
        var $modal = $('#taskModal');

        $.ajax('/tasks/' + $task_id, {
            method: 'GET',
            success: function(response) {
                var task = response[0];

                var contents = '<form data-id="' + task.id + '" data-csrf="' + response.csrf_token + '"> <div class="row"> <div class="col-md-4"> <label for="summary">Summary</label> </div><div class="col-md-8"> <div class="form-group"><input type="text" class="form-control" id="summary" value="' + task.summary + '"></div></div></div><div class="row"> <div class="col-md-4"> <label for="date">Due Date</label> </div><div class="col-md-8"> <div class="form-group"> <input type="date" class="form-control" id="date" value="' + task.due_date + '"> </div></div></div><div class="row"> <div class="col-md-4"> <label for="description">Description</label> </div><div class="col-md-8"> <div class="form-group"> <textarea class="form-control" id="description">' + task.description + '</textarea> </div></div></div><div class="row"> <div class="col-md-6"><button id="edit-task-btn" type="button" class="btn btn-primary float-left">Submit</button></div><div class="col-md-6"><button type="button" class="btn btn-danger float-right" data-dismiss="modal">Cancel</button></div></div></form>';

                showModal('Edit a task', contents);
            }
        });
    });

    $(document).on('click', '#edit-task-btn', function(e) {
        var $form = $(this).parent().parent().parent();
        var $table = $('#tasks-table');

        $.ajax('/tasks/' + $form.attr('data-id') + '/update', {
            method: 'PUT',
            data: [
                {name: '_token', value: $form.attr('data-csrf')},
                {name: 'summary', value: $form.find('#summary').val()},
                {name: 'due_date', value: $form.find('#date').val()},
                {name: 'description', value: $form.find('#description').val()}
            ],
            success: function (response) {
                var task = response[0];

                var $task_row = $table.find('tr[data-id=' + task.id + ']');

                var $task = {
                    0: task.summary,
                    1: '<select class="form-control status-select" name="status" id="status"> <option ' +
                    'value="1" ' + (task.status==1 ? 'selected' : '') + '>Pending</option> <option value="2" ' + (task.status==2 ? 'selected' : '') + '>In progress</option> <option value="3" ' + (task.status==3 ? 'selected' : '') + '>Completed</option> </select>',
                    2: task.due_date,
                    3: '<button class="btn btn-primary edit-btn" type="button" data-action="edit"><i class="fa ' +
                    'fa-pencil"></i></button> <button class="btn ' + (task.status==3 ? 'btn-success' : 'btn-secondary') + ' complete-btn" type="button" name="complete"><i class="fa fa-check"></i></button> <button class="btn btn-danger delete-btn" type="button" name="delete"><i class="fa fa-trash"></i></button>'
                };

                var $row = $dataTable.row($task_row).data($task);

                var $checkbox = $('#show-completed');
                var checked = $checkbox.is(':checked');

                if (checked) {
                    console.log('checked');
                    if (task.status < 3) {
                        console.log('< 3');
                        $task_row.hide();
                    }
                }

                hideModal();

                window.toastr.success('Task successfully edited!');
            }
        });
    });

    $(document).on('click', '.complete-btn', function() {
        var $task = $(this).parent().parent();
        var $task_id = $task.attr('data-id');
        var $select = $task.find('.status-select');

        $.ajax('/tasks/' + $task_id + '/updateStatus', {
            method: 'PUT',
            data: [
                {name: '_token', value: $task.attr('data-csrf')},
                {name: 'status', value: 3}
            ],
            success: function(task) {
                $task.attr('data-status', task.status);
                $task.children().find('.complete-btn').removeClass('btn-secondary').addClass('btn-success');
                $select.val(3);
                $task.find('.summary').css('text-decoration', 'line-through');
                window.toastr.success('Task status changed!');
            }
        });
    });

    $(document).on('click', '.delete-btn', function() {
        var $task = $(this).parent().parent();
        var $task_id = $task.attr('data-id');

        $.ajax('/tasks/' + $task_id + '/delete', {
            method: 'DELETE',
            data: [
                {name: '_token', value: $task.attr('data-csrf')}
            ],
            success: function(task) {
                $dataTable.row($task).remove().draw();

                window.toastr.warning('Task successfully deleted!');
            }
        });
    });

    $(document).on('change', '.status-select', function() {
        var $task = $(this).parent().parent();
        var $task_id = $task.attr('data-id');
        var $select = $(this);

        $.ajax('/tasks/' + $task_id + '/updateStatus', {
            method: 'PUT',
            data: [
                {name: '_token', value: $task.attr('data-csrf')},
                {name: 'status', value: $select.val()}
            ],
            success: function(task) {
                $task.attr('data-status', task.status);

                var $checkbox = $('#show-completed');
                var checked = $checkbox.is(':checked');

                if (checked) {
                    if (task.status < 3) {
                        $($task).hide();
                    }
                }

                if (task.status == 3) {
                    $task.children().find('.complete-btn').removeClass('btn-secondary').addClass('btn-success');
                    $task.find('.summary').css('text-decoration', 'line-through');
                } else {
                    $task.children().find('.complete-btn').removeClass('btn-success').addClass('btn-secondary');
                    $task.find('.summary').css('text-decoration', 'none');
                }

                window.toastr.success('Task status changed!');
            }
        });
    });

    $(document).on('change', '#show-completed', function () {
        var checked = $(this).is(':checked');

        if (checked) {
            $table.find('tr[data-status=1]').hide();
            $table.find('tr[data-status=2]').hide();
        } else {
            $table.find('tr[data-status=1]').show();
            $table.find('tr[data-status=2]').show();
        }
    });
});