<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProformaModule extends Model
{
    protected $fillable = [
        'module_name',
    ];

    /**
     * Get all of the proformas for the ProformaModule
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function proformas(): HasMany
    {
        return $this->hasMany(Proforma::class);
    }
}
