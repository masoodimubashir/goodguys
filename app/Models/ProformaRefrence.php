<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProformaRefrence extends Model
{

    public $timestamps = false;

    protected $fillable = [
        'proforma_number',
        'is_converted_to_invoice',
        'client_id',
        'created_at',
    ];


    protected $casts = [
        'created_at' => 'datetime',
    ];



   /**
    * Get all of the proformas for the ProformaRefrence
    *
    * @return \Illuminate\Database\Eloquent\Relations\HasMany
    */
   public function proformas(): HasMany
   {
       return $this->hasMany(Proforma::class);
   }


    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
