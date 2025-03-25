<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{

    /** @use HasFactory<\Database\Factories\InventoryFactory> */
    use HasFactory;

    
    protected $fillable = ['item_name', 'selling_price', 'buying_price', 'item_type', 'item_dimension', 'item_size', 'created_by', 'updated_by', 'count'];


    protected $casts = [
        'item_dimension' => 'array',
        'item_size' => 'array',
    ];
}
