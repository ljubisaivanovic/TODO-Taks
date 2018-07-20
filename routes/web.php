<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*
 * GET : Uzimanje resursa
 * POST : Kreiranje novog resursa
 * PUT : Azuriranje resursa
 * DELETE : Brisanje resursa
 */



Route::get('/', 'TaskController@index');
Route::get('/tasks/{id}', 'TaskController@show')->name('tasks.show');
Route::post('/tasks', 'TaskController@create')->name('tasks.create');
Route::delete('/tasks/{id}/delete', 'TaskController@destroy')->name('tasks.destroy');
Route::put('/tasks/{id}/update', 'TaskController@update')->name('tasks.update');
Route::put('/tasks/{id}/updateStatus', 'TaskController@updateStatus')->name('tasks.update-status');