<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Task;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::all();

        return view('index', [
            'tasks' => $tasks
        ]);
    }

    public function create(Request $request)
    {
        $task = Task::create($request->all());

        return JsonResponse::create(['csrf_token' => csrf_token(), $task]);
    }

    public function show($id)
    {
        $task = Task::find($id);

        return JsonResponse::create(['csrf_token' => csrf_token(), $task]);
    }

    public function destroy($id)
    {
        $task = Task::find($id);
        $task->delete();

        return JsonResponse::create(null);
    }

    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        $task->update($request->all());

        return JsonResponse::create(['csrf_token' => csrf_token(), $task]);
    }

    public function updateStatus(Request $request, $id)
    {
        $task = Task::find($id);

        $status = $request->status;

        $task->update([
            'status' => $status
        ]);

        return JsonResponse::create($task);
    }
}