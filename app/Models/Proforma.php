<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Proforma extends Model
{
    protected $fillable = [
        'client_id',
        'module_id',
        'item_name',
        'description',
        'count',
        'price',
        'tax',
        'service_charge',
        'created_by',
        'updated_by'
    ];

    public function client(): BelongsTo{
        return $this->belongsTo(Client::class);
    }

    public function module(): BelongsTo{
        return $this->belongsTo(Module::class);
    }
}
