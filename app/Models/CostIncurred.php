<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CostIncurred extends Model
{
    

    protected $fillable = [
        'client_id',
        'entry_name',
        'count',
        'selling_price',
        'buying_price',
        'created_by',
        'updated_by',
    ];


    protected $casts = [
        'selling_price' => 'integer',
        'buying_price' => 'integer',
        'count' => 'integer',
    ];



}
