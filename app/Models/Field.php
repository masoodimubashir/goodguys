<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Field extends Model
{
    
    protected $fillable = ['field_name', 'si_unit', 'dimension_value',  'created_by', 'updated_by'];

}
