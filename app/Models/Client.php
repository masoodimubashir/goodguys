<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'client_name',
        'client_email',
        'client_address',
        'service_charge',
        'client_phone',
        'created_by',
        'updated_by',
        'site_name'
    ];

}
