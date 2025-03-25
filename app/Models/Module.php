<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Module extends Model
{
    protected $fillable = [
        'module_name',
        'count',
        'field_ids',
        'created_by',
        'updated_by',
        'description'
    ];

    protected $casts = [
        'count' => 'integer',
        'field_ids' => 'array',
    ];

}
