<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendor extends Model
{

    protected $fillable = [
        'vendor_name',
        'contact_number',
        'email',
        'address',
        'description',
        'created_by',
        'updated_by',
    ];

    /**
     * Get all of the purchaseList for the Vendor
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function purchaseLists(): HasMany
    {
        return $this->hasMany(PurchaseList::class);
    }


    /**
     * Get all of the purchaseListPayments for the Vendor
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function purchaseListPayments(): HasMany
    {
        return $this->hasMany(PurchaseListPayment::class);
    }

    
}
