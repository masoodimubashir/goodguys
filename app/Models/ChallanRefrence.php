<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChallanRefrence extends Model
{

    protected $fillable = [
        'client_id',
        'challan_number',
        'service_charge',
    ];

    
    public function challans()
    {
        return $this->hasMany(Challan::class);
    }

    public function purchaseList()
    {
        return $this->belongsTo(PurchaseList::class);
    }

    /**
     * Get the client that owns the ChallanRefrence
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
