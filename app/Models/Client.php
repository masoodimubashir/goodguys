<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Client extends Model
{

    protected $fillable = [
        'client_name',
        'client_email',
        'client_address',
        'client_phone',
        'created_by',
        'updated_by',
        'site_name',
    ];


    /**
     * Get all of the accounts for the Client
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
     public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }


    public function invoiceRefrences(): HasMany
    {
        return $this->hasMany(InvoiceRefrence::class);
    }


    public function proformaRefrences(): HasMany
    {
        return $this->hasMany(ProformaRefrence::class);
    }


    /**
     * Get the serviceCharge associated with the Client
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function serviceCharge(): HasOne
    {
        return $this->hasOne(ServiceCharge::class,);
    }


    protected function casts(): array
    {
        return [
            'service_charge' => 'integer',
        ];
    }
}
