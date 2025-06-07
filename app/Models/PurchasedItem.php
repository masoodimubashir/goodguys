<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchasedItem extends Model
{
    protected $fillable = [
        'client_id' ,
        'unit_type'  ,
        'description' ,
        'qty' ,
        'price',
        'narration',
        'total',
        'is_credited',
        'created_by',
        'updated_by',
    ];
}
