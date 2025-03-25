<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FieldUnit extends Model
{
    protected $fillable = [
        'field_id',
        'unit_size',
        'unit_count',
        'created_by',
        'updated_by',
    ];


    protected $casts = [
        'unit_size' => 'array', 
    ];

    public function modules(): HasMany{
        return $this->hasMany(Module::class);
    }

    public function field(): BelongsTo
    {
        return $this->belongsTo(Field::class);
    }
}
