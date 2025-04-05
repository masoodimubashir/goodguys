<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{

    protected $fillable = [
        'invoice_number',
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

    protected $casts = [
        'count' => 'integer',
        'price' => 'integer',
        'tax' => 'integer',
        'service_charge' => 'integer',
        'due_date' => 'datetime',
    ];


}
