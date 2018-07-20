<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css" integrity="sha384-Smlep5jCw/wG7hdkwQ/Z5nLIefveQRIY9nfy6xoR1uRYBtpZgI6339F5dgvm/e9B" crossorigin="anonymous">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs4/jq-3.3.1/dt-1.10.18/datatables.min.css"/>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"/>

    <title>Tasks</title>
</head>
<body>
<div class="container" style="padding: 25px 0;">
    <div class="row">
        <div class="col-md-6">
            <button type="button" class="btn btn-primary new-btn float-left" data-action="new">New
                task</button>
        </div>
        <div class="col-md-6">
            <div class="form-group float-right">
                <input type="checkbox" id="show-completed">
                <label for="show-completed">Show completed tasks</label>
            </div>
        </div>
    </div>

    <table class="table table-sm table-bordered text-left" id="tasks-table">
        <thead>
            <tr>
                <th>Summary</th>
                <th data-orderable="false">Status</th>
                <th>Due Date</th>
                <th data-orderable="false">Actions</th>
            </tr>
        </thead>

        @foreach($tasks as $task)
            <tr data-id="{{ $task->id }}" data-csrf="{{ csrf_token() }}" data-status="{{ $task->status }}">
                <td style="text-decoration: {{ $task->status == 3 ? 'line-through' : 'none' }}" class="summary">{{
                $task->summary }}</td>
                    <input type="hidden" name="id" value="{{ $task->id }}" />
                <td>
                    <select class="form-control status-select" name="status" id="status">
                        <option value="1" {{ $task->status == 1 ? "selected" : "" }}>Pending</option>
                        <option value="2" {{ $task->status == 2 ? "selected" : "" }}>In progress</option>
                        <option value="3" {{ $task->status == 3 ? "selected" : "" }}>Completed</option>
                    </select>
                </td>
                <td>{{ $task->due_date }}</td>
                <td>
                    <button class="btn btn-primary edit-btn" type="button" data-action="edit"><i class="fa
                    fa-pencil"></i></button>
                    <button class="btn {{ $task->status == 3 ? 'btn-success' : 'btn-secondary' }} complete-btn" type="button" name="complete"><i class="fa
                    fa-check"></i></button>
                    <button class="btn btn-danger delete-btn" type="button" name="delete"><i class="fa
                    fa-trash"></i></button>
                </td>
            </tr>
        @endforeach
    </table>
</div>

<div class="modal fade" id="taskModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 id="taskModal-title" class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body" id="taskModal-contents">

            </div>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/v/bs4/jq-3.3.1/dt-1.10.18/datatables.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/js/bootstrap.min.js" integrity="sha384-o+RDsa0aLu++PJvFqy8fFScvbHFLtbvScb8AjopnFD+iEQ7wo/CG0xlczd+2O/em" crossorigin="anonymous"></script>
<script src="{{ asset('js/app.js') }}"></script>
</body>
</html>