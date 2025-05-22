<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseList extends Model
{

    protected $fillable = [
        'client_id',
        'vendor_name',
        'purchase_date',
        'bill',
        'bill_total',
        'bill_description',
        'created_by',
        'updated_by',
    ];


    protected $casts = [
        'purchase_date' => 'date',
        'bill_total' => 'integer',
    ];

    /**
     * Get all of the returnLists for the PurchaseList
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function returnLists(): HasMany
    {
        return $this->hasMany(ReturnList::class);
    }

    /**
     * Get all of the  for the PurchaseList
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function purchasedProducts(): HasMany
    {
        return $this->hasMany(PurchasedProduct::class);
    }


    /**
     * Get all of the challanRefrences for the PurchaseList
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function challanRefrences(): HasMany
    {
        return $this->hasMany(ChallanRefrence::class);
    }

    
}
