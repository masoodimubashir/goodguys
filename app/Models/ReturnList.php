<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnList extends Model
{

    protected $fillable = [
        'purchase_list_id',
        'vendor_name',
        'return_date',
        'bill',
        'bill_total',
        'bill_description',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'return_date' => 'date',
        'bill_total' => 'integer',
    ];
}
