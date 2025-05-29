<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseManagment extends Model
{
    

    protected $fillable = [
        'purchase_list_id',
        'amount',
        'narration',
        'transaction_date',
        'created_by',
        'updated_by',
    ];


    /**
     * Get the purchaseList that owns the PurchaseManagment
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function purchaseList(): BelongsTo
    {
        return $this->belongsTo(PurchaseList::class);
    }


}
