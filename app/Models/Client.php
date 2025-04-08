<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'site_name',
        'tax',
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

    protected function casts(): array
    {
        return [
            'tax' => 'integer',
            'profit'  => 'integer',
            'service_charge' => 'integer',
        ];
    }
}
