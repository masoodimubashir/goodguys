<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchasedItem extends Model
{

    public $timestamps = false;


    protected $fillable = [
        'client_id',
        'unit_type',
        'description',
        'qty',
        'price',
        'narration',
        'total',
        'is_credited',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
        'multiplier',
        'payment_flow'
    ];


    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
