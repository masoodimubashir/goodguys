<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseList extends Model
{


    protected $fillable = [
        'client_id',
        'vendor_id',
        'purchase_date',
        'list_name',
        'bill',
        'bill_total',
        'bill_description',
        'created_by',
        'updated_by',
    ];


    protected $casts = [
        'bill_total' => 'integer',
    ];

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
     * Get the client that owns the PurchaseList
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }


    /**
     * Get the vendor that owns the PurchaseList
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Get all of the purchasemanagments for the PurchaseList
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function purchaseManagments(): HasMany
    {
        return $this->hasMany(PurchaseManagment::class);
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
