<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function purchaseLists()
    {
        return $this->belongsTo(PurchaseList::class);
    }

    /**
     * Get all of the returnLists for the PurchaseList
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function returnLists(): HasMany
    {
        return $this->hasMany(ReturnList::class);
    }
}
