<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseList extends Model
{

    protected $fillable = [
        'client_id',
        'vendor_name',
        'purchase_date',
        'bill',
        'created_by',
        'updated_by',
    ];


    protected $casts = [
        'purchase_date' => 'date',
    ];
}


