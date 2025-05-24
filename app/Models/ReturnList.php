<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnList extends Model
{

    protected $fillable = [
        'purchased_product_id',
        'vendor_name',
        'return_date',
        'bill_total',
        'unit_count',
        'bill_description',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'bill_total' => 'integer',
        'unit_count' => 'integer',
    ];
}
