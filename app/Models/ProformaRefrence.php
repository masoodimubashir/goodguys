<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProformaRefrence extends Model
{

    protected $fillable = [
        'proforma_number',
        'client_id',
    ];

    public function proformas(): HasMany
    {
        return $this->hasMany(Proforma::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
