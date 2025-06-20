<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class PaymentDeleteRefrence extends Model
{
    protected $fillable = [
        'purchased_item_id',
        'refrence_id',
        'refrence_type',
    ];


    
}
