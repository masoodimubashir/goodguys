<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnList extends Model
{

    protected $fillable = [
        'purchase_list_id',
        'item_name',
        'return_date',
        'price',
        'narration',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'price' => 'integer',
    ];
}
