<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{


    protected $fillable = [
        'product_name',
        'proforma_refrence_id',
        'invoice_refrence_id',
    ];



    /**
     * Get all of the proformas for the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function proformas(): HasMany
    {
        return $this->hasMany(Proforma::class);
    }

    /**
     * Get all of the proformas for the Invoice
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
