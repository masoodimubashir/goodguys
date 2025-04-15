<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceCharge extends Model
{

    protected $fillable = [
        'client_id',
        'service_charge',
    ];


    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
