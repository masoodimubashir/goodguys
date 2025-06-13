<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class PurchaseListPayment extends Model
{


    protected $fillable = [
        'vendor_id',
        'client_id',
        'amount',
        'narration',
        'transaction_date',
        'created_by',
        'updated_by',
    ];


    
    /**
     * Get the vendor that owns the PurchaseManagment
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

}
