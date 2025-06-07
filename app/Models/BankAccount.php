<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{


    protected $fillable = [
        'qr_code_image',
        'bank_name',
        'ifsc_code',
        'branch_code',
        'holder_name',
        'account_number',
        'swift_code',
        'upi_number',
        'upi_address',
        'signiture_image',
        'company_stamp_image',
        'tax_number',
        'created_by',
        'updated_by'
    ];


    
}
