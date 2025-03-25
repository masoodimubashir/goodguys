<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sale extends Model
{
    protected $fillable = [
        'inventory_id',
        'item_name',
        'selling_price',
        'buying_price',
        'count',
        'profit',
        'created_by',
        'updated_by',
    ];


    public function inventory(): BelongsTo{
        return $this->belongsTo(Inventory::class);
    }

}
