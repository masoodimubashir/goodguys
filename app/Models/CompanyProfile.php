<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyProfile extends Model
{


    protected $fillable = [
        'company_name',
        'company_address',
        'company_contact_no',
        'company_email',
        'logo',
        'created_by',
        'updated_by'
    ];


    
}
