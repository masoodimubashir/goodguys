<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillItemList extends Model
{
    protected $fillable = [
        'purchase_list_id',
        'item_description',
        'item_quantity',
        'item_price'
    ];




}
