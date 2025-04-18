<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{

    protected $fillable = [
        'invoice_refrence_id',
        'item_name',
        'count',
        'price',
        'tax',
        'service_charge',
        'created_by',
        'updated_by',
        'additional_description',
        'description',

    ];

    protected $casts = [
        'count' => 'integer',
        'price' => 'integer',
        'tax' => 'integer',
        'service_charge' => 'integer',
        'due_date' => 'datetime',
    ];


  

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function invoiceRefrence(): BelongsTo
    {
        return $this->belongsTo(InvoiceRefrence::class);
    }
}
