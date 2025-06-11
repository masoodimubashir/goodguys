<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Client extends Model
{

    public $timestamps = false;


    protected $fillable = [
        'client_name',
        'client_type',
        'client_email',
        'client_address',
        'client_phone',
        'created_by',
        'updated_by',
        'site_name',
        'created_at',
        'updated_at'
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



    /**
     * Get all of the purchaseLists for the Client
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function purchaseLists(): HasMany
    {
        return $this->hasMany(PurchaseList::class);
    }


    /**
     * Get all of the costIncurreds for the Client
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function costIncurreds(): HasMany
    {
        return $this->hasMany(CostIncurred::class);
    }


    /**
     * Get the bankAccount associated with the Client
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function bankAccount(): HasOne
    {
        return $this->hasOne(BankAccount::class);
    }

    /**
     * Get all of the purchaseItems for the Client
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function purchaseItems(): HasMany
    {
        return $this->hasMany(PurchasedItem::class);
    }


    /**
     * Get all of the challanRefrences for the Client
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function challanRefrences(): HasMany
    {
        return $this->hasMany(ChallanRefrence::class);
    }


    /**
     * Get all of the projectDocuments for the Client
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function projectDocuments(): HasMany
    {
        return $this->hasMany(ProjectDocument::class);
    }

    /**
     * Get all of the clientAccounts for the Client
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function clientAccounts(): HasMany
    {
        return $this->hasMany(ClientAccount::class);
    }


    protected function casts(): array
    {
        return [
            'service_charge' => 'integer',
        ];
    }
}
