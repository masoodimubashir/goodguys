<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientProduct extends Model
{
    
    protected $fillable = [
        'client_name',
        'client_email',
        'client_address',
        'service_charge',
        'client_phone',
        'created_by',
        'updated_by',
        'site_name',
        'amount',
        'tax',
    ];


    protected function casts(): array
    {
        return [
            'tax' => 'integer',
            'profit'  => 'integer',
            'service_charge' => 'integer',
        ];
    }

}
