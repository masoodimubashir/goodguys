<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Challan extends Model
{


    public $timestamps = false;

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
        'is_credited',
        'created_at',
    ];
              
    public function challanRefrence(): BelongsTo
    {
        return $this->belongsTo(ChallanRefrence::class);
    }
}
