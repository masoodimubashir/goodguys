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

    /**
     * Get all of the products for the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }


    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
