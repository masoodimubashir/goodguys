<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Account extends Model
{

    protected $fillable = [
        'client_id',
        'item_name',
        'selling_price',
        'buying_price',
        'count',
        'service_charge',
        'description',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'selling_price' => 'integer',
            'buying_price'  => 'integer',
            'service_charge' => 'integer',
            'description' => 'json',
        ];
    }

    protected $appends = ['service_charge_amount'];


    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }

    // Get The Service Charge Amount
    public function getServiceChargeAmountAttribute()
    {
        return ($this->selling_price * $this->service_charge) / 100;
    }
}
