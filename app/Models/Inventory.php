<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{

    /** @use HasFactory<\Database\Factories\InventoryFactory> */
    use HasFactory;


    protected $fillable = [
        'item_name',
        'selling_price',
        'buying_price',
        'item_type',
        'item_dimensions',
        'created_by',
        'updated_by',
        'count',
        'item_sub_type',
        'description',
    ];


    protected $casts = [
        'item_dimensions' => 'array',
        'buying_price' => 'integer',
        'selling_price' => 'integer',
        'count' => 'integer',
    ];
}
