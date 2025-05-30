<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Challan extends Model
{


    protected $fillable = [
        'challan_refrence_id',
        'is_price_visible',
        'price',
        'qty',
        'description',
        'unit_type',
        'created_by',
        'updated_by',
        'total',
        'narration',
    ];
              
    public function challanRefrence(): BelongsTo
    {
        return $this->belongsTo(ChallanRefrence::class);
    }
}
