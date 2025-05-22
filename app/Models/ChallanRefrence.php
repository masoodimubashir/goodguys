<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChallanRefrence extends Model
{

    protected $fillable = [
        'purchase_list_id',
        'challan_number',
        'service_charge',
    ];

    
    public function challans()
    {
        return $this->hasMany(Challan::class);
    }

    public function purchaseList()
    {
        return $this->belongsTo(PurchaseList::class);
    }
}
