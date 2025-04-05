<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Module extends Model
{
    protected $fillable = [
        'module_name',
        'selling_price',
        'buying_price',
        'count',
        'fields',
        'created_by',
        'updated_by',
        'description'
    ];

    protected $casts = [
        'count' => 'integer',
        'fields' => 'array',
        'selling_price' => 'integer',
        'buying_price' => 'integer',
    ];

}
