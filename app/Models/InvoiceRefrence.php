<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvoiceRefrence extends Model
{

    protected $fillable = [
        'invoice_number',
        'client_id',
    ];


    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

   
}
