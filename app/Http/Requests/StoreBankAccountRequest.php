<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBankAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'qr_code_image' => 'required|file|mimes:jpeg|max:2048',
            'bank_name' => 'required|string|max:100',
            'ifsc_code' => 'required|string|max:32',
            'holder_name' => 'required|string|max:100',
            'account_number' => 'required|string|max:32',
            'upi_number' => 'required|sometimes|string|max:32',
            'upi_address' => 'required|string|max:250',
            'signature_image' =>  'required|file|mimes:jpeg|max:2048',
            'company_stamp_image' => 'required|file|mimes:jpeg|max:2048',
            'tax_number' => 'required|string|max:32',
        ];
    }
}
