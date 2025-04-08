<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Proforma extends Model
{
    protected $fillable = [
        'item_name',
        'proforma_refrence_id',
        'description',
        'additional_description',
        'count',
        'price',
        'tax',
        'service_charge',
        'created_by',
        'updated_by'
    ];

   

    public function module(): BelongsTo{
        return $this->belongsTo(Module::class);
    }

    public function proformaRefrence(): BelongsTo{
        return $this->belongsTo(ProformaRefrence::class);
    }
}
