<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'summary', 'description', 'due_date', 'status'
    ];
}