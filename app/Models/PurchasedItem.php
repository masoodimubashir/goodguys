<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PurchasedItem extends Model
{

    public $timestamps = false;


    protected $fillable = [
        'client_id',
        'unit_type',
        'description',
        'qty',
        'price',
        'narration',
        'total',
        'is_credited',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
        'multiplier',
        'payment_flow'
    ];


    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    /**
     * Get the payemntDeleteRefrence associated with the PaymentDeleteRefrence
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function payemntDeleteRefrence(): HasOne
    {
        return $this->hasOne(PaymentDeleteRefrence::class);
    }

   
}
