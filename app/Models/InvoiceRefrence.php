<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvoiceRefrence extends Model
{

    public $timestamps = false;

    protected $fillable = [
        'invoice_number',
        'client_id',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
    ];


    protected $casts = [
        'created_at' => 'datetime',
    ];


    /**
     * Get all of the invoices for the InvoiceRefrence
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
