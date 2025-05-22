<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchasedProduct extends Model
{
    protected $fillable = [
        'purchase_list_id',
        'product_name',
        'price',
        'unit_count',
        'description',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'price' => 'integer',
        'unit_count' => 'integer',
    ];

    public function purchaseList()
    {
        return $this->belongsTo(PurchaseList::class);
    }
}
