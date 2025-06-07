<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Proforma extends Model
{
    protected $fillable = [
        'item_name',
        'description',
        'additional_description',
        'count',
        'price',
        'service_charge',
        'created_by',
        'updated_by',
        'is_price_visible',
        'proforma_module_id',
        'proforma_refrence_id',
    ];



    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the proformaModule that owns the Proforma
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function proformaModule(): BelongsTo
    {
        return $this->belongsTo(ProformaModule::class);
    }
}
